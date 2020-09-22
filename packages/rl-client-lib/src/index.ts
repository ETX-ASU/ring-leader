import { NamesAndRoles } from "@asu-etx/rl-server-lib";
const getUsers = (token: any): any => {
  return new NamesAndRoles().getMembers(token);
};

export { getUsers };
