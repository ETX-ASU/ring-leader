
import { getConnection } from "../database/db";
import Assignment from "../database/entities/Assignment";

const createAssignment = async (consumer: Assignment): Promise<Assignment> => {
  const connection = await getConnection();
  const assignmentRepository = connection.getRepository(Assignment);
  return assignmentRepository.save(consumer);
}

const getAssignmentsByClientId = async (name: String): Promise<Assignment[]> => {
  const connection = await getConnection();
  const assignmentRepository = connection.getRepository(Assignment);
  const assignments = await assignmentRepository.find({
    where: {
      name: name
    }
  });
  return assignments;
};

export { createAssignment, getAssignmentsByClientId }

