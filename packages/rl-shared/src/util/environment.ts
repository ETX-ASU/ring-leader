// heroku
const ENV_VARS = process.env;
console.log(`process.env in environments.ts: ${JSON.stringify(process.env)}`);
console.log(`ENV_VARS.INSTRUCTOR_REDIRECT: ${ENV_VARS.INSTRUCTOR_REDIRECT}`);
console.log(`ENV_VARS.[INSTRUCTOR_REDIRECT]: ${ENV_VARS["INSTRUCTOR_REDIRECT"]}`);

export const PORT: number = parseInt(ENV_VARS.PORT ? ENV_VARS.PORT : "8080");

// this is set by the yarn run heroku-update-configs script
export const APPLICATION_URL: string = ENV_VARS.APPLICATION_URL || "";

// ENDPOINTS
export const DEEP_LINK_ASSIGNMENT_ENDPOINT: string =
  ENV_VARS.DEEP_LINK_ASSIGNMENT_ENDPOINT || "/lti-service/deeplink";
export const DEEP_LINK_RESOURCELINKS_ENDPOINT: string =
  ENV_VARS.DEEP_LINK_RESOURCELINKS_ENDPOINT ||
  "/lti-service/getDeepLinkAssignments";
export const ROSTER_ENDPOINT: string =
  ENV_VARS.ROSTER_ENDPOINT || "/lti-service/roster";
export const CREATE_ASSIGNMENT_ENDPOINT: string =
  ENV_VARS.CREATE_ASSIGNMENT_ENDPOINT || "/lti-service/createassignment";
export const GET_ASSIGNMENT_ENDPOINT: string =
  ENV_VARS.GET_ASSIGNMENT_ENDPOINT || "/lti-service/getassignment";
export const GET_UNASSIGNED_STUDENTS_ENDPOINT: string =
  ENV_VARS.GET_UNASSIGNED_STUDENTS_ENDPOINT ||
  "/lti-service/unassignedstudents";
export const GET_ASSIGNED_STUDENTS_ENDPOINT: string =
  ENV_VARS.GET_ASSIGNED_STUDENTS_ENDPOINT ||
  "/lti-service/assignedstudents";
export const PUT_STUDENT_GRADE_VIEW: string =
  ENV_VARS.PUT_STUDENT_GRADE_VIEW || "/lti-service/putGradeStudentView";
export const PUT_STUDENT_GRADE: string =
  ENV_VARS.PUT_STUDENT_GRADE || "/lti-service/putGrade";
export const DELETE_LINE_ITEM: string =
  ENV_VARS.DELETE_LINE_ITEM || "/lti-service/deleteLineItem";
export const GET_GRADES: string = ENV_VARS.GET_GRADES || "/lti-service/grades";

export const OIDC_LOGIN_INIT_ROUTE =
  ENV_VARS.OIDC_LOGIN_INIT_ROUTE || "/init-oidc";
export const LTI_ADVANTAGE_LAUNCH_ROUTE =
  ENV_VARS.LTI_ADVANTAGE_LAUNCH_ROUTE || "/lti-advantage-launch";

export const TOOL_INFO = ENV_VARS.TOOL_INFO || "/tool-info";
export const GET_JWKS_ENDPOINT = ENV_VARS.GET_JWKS_ENDPOINT || "/jwks";

export const LTI_ASSIGNMENT_REDIRECT =
  ENV_VARS.LTI_ASSIGNMENT_REDIRECT || "/assignment";
export const LTI_DEEPLINK_REDIRECT =
  ENV_VARS.LTI_DEEPLINK_REDIRECT || "/deeplink";
export const LTI_STUDENT_REDIRECT = ENV_VARS.STUDENT_REDIRECT || "/student";
export const LTI_INSTRUCTOR_REDIRECT =
  ENV_VARS.INSTRUCTOR_REDIRECT || "/instructor";

export const LOGGING_LEVEL = ENV_VARS.LOGGING_LEVEL || "error";
export const PLATFORM = ENV_VARS.PLATFORM || "aws";
