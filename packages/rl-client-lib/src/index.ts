// eslint-disable-next-line node/no-extraneous-import
import { NamesAndRoles } from "@asu-etx/rl-server-lib";
const getUsers = (token: string): any => {
  return new NamesAndRoles().getMembers(token, {});
};

export { getUsers };
