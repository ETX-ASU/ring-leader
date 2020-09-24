import { NamesAndRoles, RlPlatform } from "@asu-etx/rl-server-lib";
const getUsers = (platform: any): any => {
  return new NamesAndRoles().getMembers(platform);
};
export { getUsers, RlPlatform };
