import { teacherFacialExpressions } from "@/config/avatar/teacher";

import TeacherAvatar from "../TeacherAvatar";

export const useAvatar = (type: string) => {
  switch (type) {
    case "teacher":
    default:
      return {
        modelPath: "/models/avatars/teacher.glb",
        animationsPath: "/models/animations/teacher-animations.glb",
        facialExpressions: teacherFacialExpressions,
        component: TeacherAvatar,
      };
  }
};
