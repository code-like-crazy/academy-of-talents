import { teacherFacialExpressions } from "@/config/avatar/teacher";
import { AvailableAvatars, getAvatarById } from "@/config/avatars";

import TeacherAvatar from "../TeacherAvatar";

export const useAvatar = (type: AvailableAvatars) => {
  const avatar = getAvatarById(type);

  if (!avatar) {
    throw new Error(`Invalid avatar type: ${type}`);
  }

  // For now, all avatars use TeacherAvatar component and facial expressions
  // This can be updated when new avatar components and expressions are added
  return {
    modelPath: avatar.modelPath,
    animationsPath: avatar.animationsPath,
    facialExpressions: teacherFacialExpressions,
    component: TeacherAvatar,
  };
};
