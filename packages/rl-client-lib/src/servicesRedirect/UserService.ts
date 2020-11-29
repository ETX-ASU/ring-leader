import axios from "axios";
import { ROSTER_ENDPOINT, GET_UNASSIGNED_STUDENTS_ENDPOINT,
  GET_ASSIGNED_STUDENTS_ENDPOINT, User, logger } from "@asu-etx/rl-shared";
import {getHash} from '../utils/hashUtils';

const getUsers = async (role: string): Promise<User[]> => {
  logger.debug(`hitting endpoint GET:${ROSTER_ENDPOINT}`);
  const results = await axios
    .get(ROSTER_ENDPOINT, { params: { role: role, hash: getHash() } })
    .then((results) => {
      logger.debug(JSON.stringify(results));
      return results.data;
    });
  return results;
};

const getUnassignedStudents = async (
  assignmentId: string,
  resourceLinkId: string
): Promise<User[]> => {
  const results = await axios
    .get(GET_UNASSIGNED_STUDENTS_ENDPOINT, {
      params: {
        lineItemId: assignmentId,
        resourceLinkId: resourceLinkId,
        hash: getHash()
      }
    })
    .then((results) => {
      logger.debug("getUnAssignedStudets-" + JSON.stringify(results.data));
      return results.data;
    });
  return results;
};

const getAssignedStudents = async (
  assignmentId: string,
  resourceLinkId: string
): Promise<User[]> => {
  const results = await axios
    .get(GET_ASSIGNED_STUDENTS_ENDPOINT, {
      params: {
        lineItemId: assignmentId,
        resourceLinkId: resourceLinkId,
        hash: getHash()
      }
    })
    .then((results) => {
      logger.debug("getAssignedStudets-" + JSON.stringify(results.data));
      return results.data;
    });
  return results;
};

export { getUsers, getUnassignedStudents, getAssignedStudents };
