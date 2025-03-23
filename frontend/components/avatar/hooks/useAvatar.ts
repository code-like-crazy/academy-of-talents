import { teacherFacialExpressions } from "@/config/avatar/teacher";
import { AvailableAvatars, getAvatarById } from "@/config/avatars";

import AriaAvatar from "../AriaAvatar";
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
