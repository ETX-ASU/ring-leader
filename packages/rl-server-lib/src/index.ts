import { Grade } from "./services/assignmentAndGradeService";
import { DeepLinking } from "./services/DeepLinking";
import { NamesAndRoles } from "./services/namesAndRolesService";
import { rlPlatform } from "./util/rlPlatform";
import requestLogger from "./middleware/requestLogger";

import rlLtiLaunchExpressEndpoints from "./endpoints/rlLtiLaunchExpressEndpoints";
import rlLtiServiceExpressEndpoints from "./endpoints/rlLtiServiceExpressEndpoints";
import cacheLtiServiceExpressEndpoints from "./endpoints/cacheLtiServiceExpressEndpoints";

import ToolConsumer from "./models/ToolConsumer";
import {Session} from "./database/entity/Session";
import initDBTables from "./database/dataconnection";

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

import {
  getRedirectToken
} from "./util/externalRedirect";

export {
  rlProcessOIDCRequest,
  getAccessToken,
  rlValidateToken,
  rlDecodeIdToken,
  rlValidateDecodedToken,
  Grade,
  DeepLinking,
  NamesAndRoles,
  rlPlatform,
  initOidcGet,
  initOidcPost,
  toolInfoGet,
  assignmentRedirectPost,
  ltiLaunchPost,
  requestLogger,
  rlLtiLaunchExpressEndpoints,
  rlLtiServiceExpressEndpoints,
  cacheLtiServiceExpressEndpoints,
  ToolConsumer,
  Session,
  initDBTables,
  getRedirectToken
};
