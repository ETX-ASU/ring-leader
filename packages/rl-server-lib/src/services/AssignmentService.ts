import { getConnection } from "../database/db";
import Assignment from "../database/entities/Assignment";

const createAssignment = async (consumer: Assignment): Promise<Assignment> => {
  console.log("Inside createAssignment service - " + JSON.stringify(consumer));

  const connection = await getConnection();
  const assignmentRepository = connection.getRepository(Assignment);
  return assignmentRepository.save(consumer);
};

const getAssignmentsByResourceId = async (
  resource_id: string
): Promise<Assignment[]> => {
  const connection = await getConnection();
  const assignmentRepository = connection.getRepository(Assignment);
  const assignments = await assignmentRepository.find({
    where: {
      resource_id: resource_id
    }
  });
  return assignments;
};

export { createAssignment, getAssignmentsByResourceId };
