import type { Bone, BufferGeometry, Material, SkinnedMesh } from "three";
import type { GLTF } from "three-stdlib";

export interface AvatarGLTFResult extends GLTF {
  nodes: {
    EyeLeft: SkinnedMesh<BufferGeometry, Material>;
    EyeRight: SkinnedMesh<BufferGeometry, Material>;
    Wolf3D_Head: SkinnedMesh<BufferGeometry, Material>;
    Wolf3D_Teeth: SkinnedMesh<BufferGeometry, Material>;
    Wolf3D_Hair: SkinnedMesh<BufferGeometry, Material>;
    Wolf3D_Body: SkinnedMesh<BufferGeometry, Material>;
    Wolf3D_Outfit_Bottom: SkinnedMesh<BufferGeometry, Material>;
    Wolf3D_Outfit_Footwear: SkinnedMesh<BufferGeometry, Material>;
    Wolf3D_Outfit_Top: SkinnedMesh<BufferGeometry, Material>;
    Wolf3D_Glasses?: SkinnedMesh<BufferGeometry, Material>;
    Hips: Bone;
  };
  materials: {
    Wolf3D_Eye: Material;
    Wolf3D_Skin: Material;
    Wolf3D_Teeth: Material;
    Wolf3D_Hair: Material;
    Wolf3D_Body: Material;
    Wolf3D_Outfit_Bottom: Material;
    Wolf3D_Outfit_Footwear: Material;
    Wolf3D_Outfit_Top: Material;
    Wolf3D_Glasses?: Material;
  };
}
