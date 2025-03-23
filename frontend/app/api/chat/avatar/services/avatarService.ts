import { AVATAR_EXPRESSIONS } from "../config/agents";
import { AgentName } from "../types";

/**
 * Service for handling avatar expressions and animations
 */
export class AvatarService {
  /**
   * Determine facial expression and animation for an avatar
   * @param agent_name The agent to use for expression selection
   * @returns Object containing expression and animation
   */
  determineExpressionAndAnimation(agent_name: AgentName) {
    const avatarConfig =
      AVATAR_EXPRESSIONS[agent_name] || AVATAR_EXPRESSIONS.default;

    // For now, just return default expression and a random animation
    // In a more advanced implementation, this could analyze the text content
    // to determine appropriate expressions
    const animations = avatarConfig.animations;
    const randomAnimation =
      animations[Math.floor(Math.random() * animations.length)];

    return {
      expression: avatarConfig.default,
      animation: randomAnimation,
    };
  }
}

// Export a singleton instance
export const avatarService = new AvatarService();
