import { getConnection } from "../database/db";
import Assignment from "../database/entities/Assignment";

const createAssignment = async (consumer: Assignment): Promise<Assignment> => {
  console.log("Inside createAssignment service - " + JSON.stringify(consumer));

  const connection = await getConnection();
  const assignmentRepository = connection.getRepository(Assignment);
  return assignmentRepository.save(consumer);
};

const getAssignmentsByGroup = async (
  group: string
): Promise<Assignment[]> => {
  const connection = await getConnection();
  const assignmentRepository = connection.getRepository(Assignment);
  const assignments = await assignmentRepository.find({
    where: {
      group: group
    }
  });
  return assignments;
};

export { createAssignment, getAssignmentsByGroup };
