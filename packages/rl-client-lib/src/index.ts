import { NamesAndRoles, RlPlatform, Grade } from "@asu-etx/rl-server-lib";
const getUsers = (platform: any, options?: any): any => {
  return new NamesAndRoles().getMembers(platform, options);
};
const getGrades = (platform: any, options?: any): any => {
  return new Grade().getGrades(platform, options);
};
const putGrade = (platform: any, score: any, options: any): any => {
  console.log("putGrade - options" + JSON.stringify(options));

  return new Grade().putGrade(platform, score, options);
};
const createLineItem = (platform: any, lineItem: any, options: any): any => {
  return new Grade().createLineItem(platform, lineItem, options);
};

const getLineItems = (platform: any, options: any): any => {
  return new Grade().getLineItems(platform, options);
};
export {
  getUsers,
  RlPlatform,
  getGrades,
  putGrade,
  createLineItem,
  getLineItems
};
