import {
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  DEEP_LINK_RESOURCELINKS_ENDPOINT,
  DEEP_LINK_DISPLAY_BASE_URL,
  DEEP_LINK_FORM_SUBMIT_SCRIPT,
  DEEP_LINK_FORWARD_SERVER_SIDE,
  ROSTER_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  GET_ASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES,
  LTI_ASSIGNMENT_REDIRECT,
  APPLICATION_URL,
  OIDC_LOGIN_INIT_ROUTE,
  LTI_ADVANTAGE_LAUNCH_ROUTE,
  LTI_STUDENT_REDIRECT,
  LTI_DEEPLINK_REDIRECT,
  LTI_SESSION_VALIDATION_ENDPOINT,
  TOOL_INFO,
  LTI_INSTRUCTOR_REDIRECT,
  GET_JWKS_ENDPOINT,
  PLATFORM,
  LTI_API_NAME,
  API_URL,
  SESSION_SECRET
} from "./util/environment";

import {
  DEEP_LINKING_SETTINGS_CLAIM,
  ROLES_CLAIM,
  INSTRUCTOR_ROLE_CLAIM,
  LEARNER_ROLE_CLAIM,
  DEPLOYMENT_ID_CLAIM,
  CONTEXT_CLAIM,
  CONTEXT_MEMBERSHIP_READ_CLAIM,
  NAMES_ROLES_CLAIM,
  ASSIGNMENT_GRADE_CLAIM,
  RESOURCE_LINK_CLAIM,
  LINE_ITEM_READ_ONLY_CLAIM,
  LINE_ITEM_CLAIM,
  SCORE_CLAIM,
  RESULT_CLAIM,
  MESSAGE_TYPE_CLAIM,
  VERSION_CLAIM,
  CONTENT_ITEMS_CLAIM,
  MSG_CLAIM,
  ERROR_MSG_CLAIM,
  LOG_CLAIM,
  ERROR_LOG_CLAIM,
  DATA_CLAIM
} from "./util/lti_claims";

import { logger }
  from "./util/LogService";

import SubmitContentItem from "./model/SubmitContentItem";
import SubmitLineItem from "./model/SubmitLineItem";
import User from "./model/User";
import LineItem from "./model/LineItem";
import SubmitGradeParams from "./model/SubmitGradeParams";
import Assignment from "./model/Assignment";
import ResultScore from "./model/ResultScore";

export {
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  DEEP_LINK_DISPLAY_BASE_URL,
  DEEP_LINK_FORM_SUBMIT_SCRIPT,
  DEEP_LINK_FORWARD_SERVER_SIDE,
  LTI_ASSIGNMENT_REDIRECT,
  APPLICATION_URL,
  ROSTER_ENDPOINT,
  DEEP_LINK_RESOURCELINKS_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  GET_ASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES,
  OIDC_LOGIN_INIT_ROUTE,
  LTI_ADVANTAGE_LAUNCH_ROUTE,
  LTI_STUDENT_REDIRECT,
  LTI_DEEPLINK_REDIRECT,
  LTI_SESSION_VALIDATION_ENDPOINT,
  TOOL_INFO,
  LTI_INSTRUCTOR_REDIRECT,
  GET_JWKS_ENDPOINT,
  logger,
  SubmitGradeParams,
  SubmitContentItem,
  SubmitLineItem,
  LineItem,
  User,
  Assignment,
  DEEP_LINKING_SETTINGS_CLAIM,
  ROLES_CLAIM,
  INSTRUCTOR_ROLE_CLAIM,
  LEARNER_ROLE_CLAIM,
  DEPLOYMENT_ID_CLAIM,
  CONTEXT_CLAIM,
  CONTEXT_MEMBERSHIP_READ_CLAIM,
  NAMES_ROLES_CLAIM,
  ASSIGNMENT_GRADE_CLAIM,
  RESOURCE_LINK_CLAIM,
  LINE_ITEM_READ_ONLY_CLAIM,
  LINE_ITEM_CLAIM,
  SCORE_CLAIM,
  RESULT_CLAIM,
  MESSAGE_TYPE_CLAIM,
  VERSION_CLAIM,
  CONTENT_ITEMS_CLAIM,
  MSG_CLAIM,
  ERROR_MSG_CLAIM,
  LOG_CLAIM,
  ERROR_LOG_CLAIM,
  DATA_CLAIM,
  PLATFORM,
  LTI_API_NAME,
  API_URL,
  SESSION_SECRET,
  ResultScore
};
