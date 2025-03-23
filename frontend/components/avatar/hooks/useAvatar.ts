import { AvailableAvatars, getAvatarById } from "@/config/avatars";

import AriaAvatar from "../AriaAvatar";
import RexAvatar from "../RexAvatar";
import TeacherAvatar from "../TeacherAvatar";

export const useAvatar = (type: AvailableAvatars) => {
  const avatar = getAvatarById(type);

  if (!avatar) {
    throw new Error(`Invalid avatar type: ${type}`);
  }

  const getAvatarComponent = () => {
    switch (avatar.id) {
      case "teacher":
        return TeacherAvatar;
      case "aria":
        return AriaAvatar;
      case "rex":
        return RexAvatar;
      default:
        return TeacherAvatar;
    }
  };

  return {
    modelPath: avatar.modelPath,
    animationsPath: avatar.animationsPath,
    facialExpressions: avatar.facialExpressions,
    component: getAvatarComponent(),
  };
};
