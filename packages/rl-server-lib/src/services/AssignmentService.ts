import { getConnection } from "../database/db";
import Assignment from "../database/entities/Assignment";

const createAssignment = async (assignment: Assignment): Promise<Assignment> => {
  console.log("Inside createAssignment service - " + JSON.stringify(consumer));

  const connection = await getConnection();
  const assignmentRepository = connection.getRepository(Assignment);
  return assignmentRepository.save(assignment);
};

const getAssignmentsByContext = async (
  context_id: string
): Promise<Assignment[]> => {
  const connection = await getConnection();
  const assignmentRepository = connection.getRepository(Assignment);
  const assignments = await assignmentRepository.find({
    where: {
      context_id: context_id
    }
  });
  return assignments;
};

export { createAssignment, getAssignmentsByContext };
