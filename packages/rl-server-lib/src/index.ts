import { Grade } from "./services/assignmentAndGradeService";
import { DeepLinking } from "./services/DeepLinking";
import { NamesAndRoles } from "./services/namesAndRolesService";
import { validateToken, rlInitiateOIDC, getAccessToken } from "./util/auth";
export {
  rlInitiateOIDC,
  getAccessToken,
  validateToken,
  Grade,
  DeepLinking,
  NamesAndRoles
};
