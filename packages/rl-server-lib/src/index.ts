import { Grade } from "./services/assignmentAndGradeService";
import { DeepLinking } from "./services/DeepLinking";
import { NamesAndRoles } from "./services/namesAndRolesService";
import { RlPlatform } from "./util/rlPlatform";
import { dbInit } from "./database/init";
import requestLogger from "./middleware/requestLogger";

import rlLtiLaunchExpressEndpoints from "./endpoints/rlLtiLaunchExpressEndpoints";
import rlLtiServiceExpressEndpoints from "./endpoints/rlLtiServiceExpressEndpoints";

import logger from "./services/LogService";
import ToolConsumer from "./database/entities/ToolConsumer";
import getDeepLinkItems from "./util/getDeepLinkItems";
import Assignment from "./database/entities/Assignment";
import {
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  ROSTER_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES
} from "./util/environment"

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
  rlLtiLaunchExpressEndpoints,
  rlLtiServiceExpressEndpoints,
  logger,
  ToolConsumer,
  getDeepLinkItems,
  Assignment,
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  ROSTER_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES
};
