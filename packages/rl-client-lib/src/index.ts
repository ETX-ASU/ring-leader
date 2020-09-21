// eslint-disable-next-line node/no-extraneous-import
import { NamesAndRoles } from "@asu-etx/rl-server-lib";
const getUser = (token: string): any => {
  return new NamesAndRoles().getMembers(token, {});
};
1;
export { getUser };
