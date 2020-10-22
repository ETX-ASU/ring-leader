import {
  NamesAndRoles,
  rlPlatform,
  Grade,
  DeepLinking,
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  ROSTER_ENDPOINT,
  DEEP_LINK_RESOURCELINKS_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES
} from "@asu-etx/rl-server-lib";

const createDeepLinkingMessage = (
  platform: any,
  contentItems: any,
  options?: any
): any => {
  return new DeepLinking().createDeepLinkingMessage(
    platform,
    contentItems,
    options
  );
};

const createDeepLinkingForm = (
  platform: any,
  contentItems: any,
  options?: any
): any => {
  return new DeepLinking().createDeepLinkingForm(
    platform,
    contentItems,
    options
  );
};

const getUsers = (platform: any, options?: any): any => {
  return new NamesAndRoles().getMembers(platform, options);
};
const getGrades = (platform: any, options?: any): any => {
  return new Grade().getGrades(platform, options);
};
const putGrade = (platform: any, score: any, options: any): any => {
  console.log("client - putGrade - options -" + JSON.stringify(options));

  return new Grade().putGrade(platform, score, options);
};
const createLineItem = (platform: any, lineItem: any, options?: any): any => {
  return new Grade().createLineItem(platform, lineItem, options);
};

const getLineItems = (platform: any, options?: any): any => {
  return new Grade().getLineItems(platform, options);
};

const deleteLineItems = (platform: any, options?: any): any => {
  return new Grade().deleteLineItems(platform, options);
};
export {
  getUsers,
  rlPlatform,
  getGrades,
  putGrade,
  createLineItem,
  getLineItems,
  createDeepLinkingMessage,
  createDeepLinkingForm,
  deleteLineItems,
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  ROSTER_ENDPOINT,
  DEEP_LINK_RESOURCELINKS_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES
};
