import API from "@aws-amplify/api";
import { LTI_API_NAME, ROSTER_ENDPOINT, GET_UNASSIGNED_STUDENTS_ENDPOINT, 
  GET_ASSIGNED_STUDENTS_ENDPOINT, logger } from "@asu-etx/rl-shared";
import {getHash, startParamsWithHash} from '../utils/hashUtils';



const getUsers = async (role: string)  => {
  logger.debug(`hitting endpoint GET:${ROSTER_ENDPOINT}`);
  const users = await API.get(LTI_API_NAME, 
    `${ROSTER_ENDPOINT}${startParamsWithHash()}&role=${role}`, null);
  return users;
};

const getUnassignedStudents = async (
  assignmentId: string,
  resourceLinkId: string
) => {
  const uanssignedStudents = await API.get(LTI_API_NAME,
    `${GET_UNASSIGNED_STUDENTS_ENDPOINT}?${startParamsWithHash()}&lineItemId=${assignmentId}&resourceLinkId=${resourceLinkId}`
  ,null);
  return uanssignedStudents;
};

const getAssignedStudents = async (
  assignmentId: string,
  resourceLinkId: string
) => {
  const uanssignedStudents = await API.get(LTI_API_NAME, GET_ASSIGNED_STUDENTS_ENDPOINT + window.location.search, {
      lineItemId: assignmentId,
      resourceLinkId: resourceLinkId,
       hash:getHash()
  });
  return uanssignedStudents;
};

export { getUsers, getUnassignedStudents, getAssignedStudents };
