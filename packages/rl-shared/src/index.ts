import {
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  DEEP_LINK_RESOURCELINKS_ENDPOINT,
  ROSTER_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
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
  TOOL_INFO,
  LTI_INSTRUCTOR_REDIRECT
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

import SubmitGradeParams from "./model/SubmitGradeParams";
import SubmitContentItem from "./model/SubmitContentItem";
import SubmitLineItem from "./model/SubmitLineItem";
import LineItem from "./model/LineItem";
import InstructorSubmitGradeParams from "./model/InstructorSubmitGradeParams";

export {
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  LTI_ASSIGNMENT_REDIRECT,
  APPLICATION_URL,
  ROSTER_ENDPOINT,
  DEEP_LINK_RESOURCELINKS_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES,
  OIDC_LOGIN_INIT_ROUTE,
  LTI_ADVANTAGE_LAUNCH_ROUTE,
  LTI_STUDENT_REDIRECT,
  LTI_DEEPLINK_REDIRECT,
  TOOL_INFO,
  LTI_INSTRUCTOR_REDIRECT,
  logger,
  SubmitGradeParams,
  SubmitContentItem,
  SubmitLineItem,
  LineItem,
  InstructorSubmitGradeParams,
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
};
