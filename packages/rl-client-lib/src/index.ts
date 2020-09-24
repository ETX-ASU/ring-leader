import { NamesAndRoles, RlPlatform } from "@asu-etx/rl-server-lib";
const getUsers = (platform: any, options?: any): any => {
  return new NamesAndRoles().getMembers(platform, options);
};
export { getUsers, RlPlatform };
