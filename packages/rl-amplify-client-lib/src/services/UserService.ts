import API from "@aws-amplify/api";
API.configure();

import { LTI_API_NAME, ROSTER_ENDPOINT, GET_UNASSIGNED_STUDENTS_ENDPOINT, GET_ASSIGNED_STUDENTS_ENDPOINT, logger, Student } from "@asu-etx/rl-shared";

const getUsers = async (role: string): Promise<any> => {
  logger.debug(`hitting endpoint GET:${ROSTER_ENDPOINT}`);
  const users = await API.get(LTI_API_NAME, ROSTER_ENDPOINT, { role: role });
  return users;
};

const getUnassignedStudents = async (
  assignmentId: string,
  resourceLinkId: string
): Promise<Student[]> => {
  const uanssignedStudents = await API.get(LTI_API_NAME, GET_UNASSIGNED_STUDENTS_ENDPOINT,   {
      lineItemId: assignmentId,
      resourceLinkId: resourceLinkId
    }
  );
  return uanssignedStudents;
};

const getAssignedStudents = async (
  assignmentId: string,
  resourceLinkId: string
): Promise<Student[]> => {
  const uanssignedStudents = await API.get(LTI_API_NAME, GET_ASSIGNED_STUDENTS_ENDPOINT, {
      lineItemId: assignmentId,
      resourceLinkId: resourceLinkId
  });
  return uanssignedStudents;
};

export { getUsers, getUnassignedStudents, getAssignedStudents };
