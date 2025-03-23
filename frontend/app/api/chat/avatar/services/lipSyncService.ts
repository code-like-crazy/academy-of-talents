import { exec } from "child_process";
import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "path";
import { promisify } from "util";

import { LipSyncData } from "../types";

const execAsync = promisify(exec);

/**
 * Service for handling lip sync generation
 */
export class LipSyncService {
  /**
   * Generate lip sync data from an audio file
   * @param audioFile Path to the audio file
   * @returns Lip sync data for animation
   */
  async generateLipSync(audioFile: string): Promise<LipSyncData> {
    try {
      // Create unique filenames based on timestamp to avoid conflicts
      const timestamp = Date.now();
      const baseDir = process.cwd();
      const wavFile = path.join(baseDir, `temp_output_${timestamp}.wav`);
      const jsonFile = path.join(baseDir, `temp_output_${timestamp}.json`);

      console.log(`Starting lip sync process for ${audioFile}`);
      console.log(`WAV file: ${wavFile}`);
      console.log(`JSON file: ${jsonFile}`);
      const startTime = Date.now();

      // Check if ffmpeg is installed
      try {
        await execAsync("which ffmpeg");
        console.log("ffmpeg is installed, proceeding with conversion");
      } catch (error) {
        console.log("ffmpeg is not installed, skipping lip sync");
        // Return a fallback empty lip sync data structure if ffmpeg is not installed
        return {
          metadata: {
            soundFile: audioFile,
            duration: 0,
            processedAt: new Date().toISOString(),
            error: "FFmpeg not installed",
          },
          mouthCues: [],
        };
      }

      // Step 1: Convert MP3 to WAV using ffmpeg
      console.log(`Converting ${audioFile} to WAV format`);
      try {
        const ffmpegCommand = `ffmpeg -y -i "${audioFile}" "${wavFile}"`;
        console.log(`Running command: ${ffmpegCommand}`);
        const { stdout, stderr } = await execAsync(ffmpegCommand);
        if (stderr) console.log("FFmpeg stderr:", stderr);
        console.log(`Conversion done in ${Date.now() - startTime}ms`);
      } catch (error: any) {
        console.error("FFmpeg conversion error:", error);
        console.log("Skipping lip sync due to ffmpeg error");

        // Return a fallback empty lip sync data structure if ffmpeg fails
        return {
          metadata: {
            soundFile: audioFile,
            duration: 0,
            processedAt: new Date().toISOString(),
            error: `FFmpeg error: ${error.message || "Unknown error"}`,
          },
          mouthCues: [],
        };
      }

      // Step 2: Run Rhubarb on the WAV file to generate lip sync data
      console.log(`Generating lip sync data with Rhubarb`);

      // Determine the correct path to rhubarb executable
      let rhubarbPath;
      if (process.env.NODE_ENV === "production") {
        // In production, use the path relative to the deployed app
        rhubarbPath = path.resolve(baseDir, "frontend", "rhubarb", "rhubarb");
      } else {
        // In development, use the path relative to the current working directory
        rhubarbPath = path.resolve(baseDir, "rhubarb", "rhubarb");
      }

      // Check if rhubarb executable exists
      try {
        await readFile(rhubarbPath);
        console.log(`Rhubarb executable found at: ${rhubarbPath}`);
      } catch (error) {
        console.error(`Rhubarb executable not found at: ${rhubarbPath}`);

        // Try to find rhubarb in alternative locations
        const possiblePaths = [
          path.resolve(baseDir, "rhubarb", "rhubarb"),
          path.resolve(baseDir, "frontend", "rhubarb", "rhubarb"),
          path.resolve(baseDir, "..", "rhubarb", "rhubarb"),
          path.resolve(baseDir, "rhubarb", "rhubarb.exe"),
          path.resolve(baseDir, "frontend", "rhubarb", "rhubarb.exe"),
        ];

        for (const altPath of possiblePaths) {
          try {
            await readFile(altPath);
            console.log(`Found rhubarb at alternative location: ${altPath}`);
            rhubarbPath = altPath;
            break;
          } catch (e) {
            // Continue checking other paths
          }
        }
      }

      // Make sure rhubarb is executable
      try {
        await execAsync(`chmod +x "${rhubarbPath}"`);
      } catch (error) {
        console.warn("Failed to set executable permission on rhubarb:", error);
      }

      try {
        // Use phonetic recognition for faster processing
        const rhubarbCommand = `"${rhubarbPath}" -f json -o "${jsonFile}" "${wavFile}" -r phonetic`;
        console.log(`Running command: ${rhubarbCommand}`);
        const { stdout, stderr } = await execAsync(rhubarbCommand);
        if (stderr) console.log("Rhubarb stderr:", stderr);
        console.log(`Lip sync data generated in ${Date.now() - startTime}ms`);
      } catch (error: any) {
        console.error("Rhubarb error:", error);

        // Check if the error is related to macOS security (developer cannot be verified)
        if (
          error.message &&
          error.message.includes(
            "cannot be opened because the developer cannot be verified",
          )
        ) {
          console.log(
            "macOS security is blocking rhubarb execution. Skipping lip sync.",
          );

          // Return a fallback empty lip sync data structure
          return {
            metadata: {
              soundFile: audioFile,
              duration: 0,
              processedAt: new Date().toISOString(),
              error:
                "macOS security blocked rhubarb execution. To fix this, open System Preferences > Security & Privacy and click 'Allow Anyway' for rhubarb, or run 'xattr -d com.apple.quarantine /path/to/rhubarb' in Terminal.",
            },
            mouthCues: [],
          };
        }

        throw new Error(
          `Failed to generate lip sync data: ${error.message || "Unknown error"}`,
        );
      }

      // Step 3: Read and validate the generated JSON file
      let lipSyncData;
      try {
        const jsonContent = await readFile(jsonFile, "utf8");
        console.log(`JSON file content length: ${jsonContent.length}`);
        lipSyncData = JSON.parse(jsonContent);

        console.log(
          `Parsed lip sync data with ${lipSyncData.mouthCues?.length || 0} mouth cues`,
        );

        if (
          !lipSyncData ||
          !lipSyncData.mouthCues ||
          !Array.isArray(lipSyncData.mouthCues)
        ) {
          throw new Error("Invalid lip sync data format");
        }

        // Add additional metadata to help with debugging
        if (!lipSyncData.metadata) {
          lipSyncData.metadata = {};
        }

        lipSyncData.metadata.processedAt = new Date().toISOString();
        lipSyncData.metadata.soundFile = audioFile;

        // Calculate total duration from the last mouth cue
        if (lipSyncData.mouthCues.length > 0) {
          const lastCue =
            lipSyncData.mouthCues[lipSyncData.mouthCues.length - 1];
          lipSyncData.metadata.duration = lastCue.end;
        }
      } catch (error: any) {
        console.error("Error reading or parsing lip sync JSON:", error);
        throw new Error(
          `Failed to read or parse lip sync data: ${error.message || "Unknown error"}`,
        );
      }

      // Cleanup temporary files
      try {
        await unlink(wavFile);
        await unlink(jsonFile);
        console.log("Temporary files cleaned up");
      } catch (error) {
        console.warn("Failed to cleanup temporary files:", error);
      }

      return lipSyncData;
    } catch (error) {
      console.error("Error generating lip sync data:", error);

      // Return a fallback empty lip sync data structure if the process fails
      return {
        metadata: {
          soundFile: audioFile,
          duration: 0,
          processedAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
        mouthCues: [],
      };
    }
  }
}

// Export a singleton instance
export const lipSyncService = new LipSyncService();
