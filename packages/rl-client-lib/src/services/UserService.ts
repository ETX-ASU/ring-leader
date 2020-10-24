import axios from "axios";
import { ROSTER_ENDPOINT, GET_UNASSIGNED_STUDENTS_ENDPOINT, logger } from "@asu-etx/rl-shared";

const getUsers = async (role: string): Promise<any> => {
  logger.debug(`hitting endpoint GET:${ROSTER_ENDPOINT}`);
  const results = await axios
    .get(ROSTER_ENDPOINT, { params: { role: role } })
    .then((results) => {
      logger.debug(JSON.stringify(results));
      return results.data;
    });
  return results;
};

const getUnAssignedStudents = (
  assignmentId: string,
  resourceLinkId: string
): Promise<any> => {
  const results = axios
    .get(GET_UNASSIGNED_STUDENTS_ENDPOINT, {
      params: {
        lineItemId: assignmentId,
        resourceLinkId: resourceLinkId
      }
    })
    .then((results) => {
      logger.debug("getUnAssignedStudets-" + JSON.stringify(results.data));
      return results.data;
    });
  return results;
};

export { getUsers, getUnAssignedStudents };
