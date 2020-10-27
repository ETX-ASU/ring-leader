import axios from "axios";
import { ROSTER_ENDPOINT, GET_UNASSIGNED_STUDENTS_ENDPOINT, GET_ASSIGNED_STUDENTS_ENDPOINT, logger, Student } from "@asu-etx/rl-shared";

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

const getUnassignedStudents = (
  assignmentId: string,
  resourceLinkId: string
): Promise<Student[]> => {
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

const getAssignedStudents = (
  assignmentId: string,
  resourceLinkId: string
): Promise<Student[]> => {
  const results = axios
    .get(GET_ASSIGNED_STUDENTS_ENDPOINT, {
      params: {
        lineItemId: assignmentId,
        resourceLinkId: resourceLinkId
      }
    })
    .then((results) => {
      logger.debug("getAssignedStudets-" + JSON.stringify(results.data));
      return results.data;
    });
  return results;
};

export { getUsers, getUnassignedStudents, getAssignedStudents };