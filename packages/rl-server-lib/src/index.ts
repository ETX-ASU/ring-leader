import { Grade } from "./services/assignmentAndGradeService";
import { DeepLinking } from "./services/DeepLinking";
import { NamesAndRoles } from "./services/namesAndRolesService";
import { RlPlatform } from "./util/rlPlatform";
import { dbInit } from "./database/init";
import requestLogger from "./middleware/requestLogger";
import rlLtiLaunchExpressEndpoints from "./endpoints/rlLtiLaunchExpressEndpoints";

import {
  rlValidateToken,
  rlValidateDecodedToken,
  rlDecodeIdToken,
  rlProcessOIDCRequest,
  getAccessToken
} from "./util/auth";

import {
  initOidcGet,
  initOidcPost,
  toolInfoGet,
  assignmentRedirectPost,
  ltiLaunchPost
} from "./services/ltiLaunchService";

export {
  rlProcessOIDCRequest,
  getAccessToken,
  rlValidateToken,
  rlDecodeIdToken,
  rlValidateDecodedToken,
  Grade,
  DeepLinking,
  NamesAndRoles,
  RlPlatform,
  initOidcGet,
  initOidcPost,
  toolInfoGet,
  assignmentRedirectPost,
  ltiLaunchPost,
  dbInit,
  requestLogger,
  rlLtiLaunchExpressEndpoints
};
