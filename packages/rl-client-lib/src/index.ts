import {
  NamesAndRoles,
  RlPlatform,
  Grade,
  DeepLinking
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
  RlPlatform,
  getGrades,
  putGrade,
  createLineItem,
  getLineItems,
  createDeepLinkingMessage,
  createDeepLinkingForm,
  deleteLineItems
};
