import { Grade } from "./services/assignmentAndGradeService";
import { DeepLinking } from "./services/DeepLinking";
import { NamesAndRoles } from "./services/namesAndRolesService";
import { RlPlatform } from "./util/rlPlatform";
import {
  rlValidateToken,
  rlValidateDecodedToken,
  rlDecodeIdToken,
  rlProcessOIDCRequest,
  getAccessToken
} from "./util/auth";
export {
  rlProcessOIDCRequest,
  getAccessToken,
  rlValidateToken,
  rlDecodeIdToken,
  rlValidateDecodedToken,
  Grade,
  DeepLinking,
  NamesAndRoles,
  RlPlatform
};
