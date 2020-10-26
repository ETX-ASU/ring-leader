import React, { useState } from "react";
import "./RouteInstructorAssignment.scss";
import {  logger, InstructorSubmitGradeParams } from "@asu-etx/rl-shared";
import { submitInstructorGrade, deleteLineItem, getUnassignedStudents as retrieveUnassignedStudents
  , getGrades as retrieveGrades, getAssignedStudents as retrieveAssignedStudents } from "@asu-etx/rl-client-lib";

const RouteInstructorAssignment: React.FC = (props: any) => {
  logger.debug("props - " + JSON.stringify(props));
  const assignmentData = props["data-assignmentData"];
  logger.debug("assignmentData - json - " + JSON.stringify(assignmentData));
  const index = props["data-index"];
  logger.debug("assignmentData id- " + assignmentData.id);
  logger.debug("index - " + index);
  const [scores, setScores] = useState<any[]>([]);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [assigned, setAssigned] = useState<any[]>([]);
  const [grade, setGrade] = useState<number>();
  const [displayCreateScoreSuccess, setDisplayCreateScoreSuccess] = useState<boolean>(false);
  const [displayUnAssignedStudents, setDisplayUnAssignedStudents] = useState<boolean>(false);
  const [
    displayDeleteAssignmentSuccess,
    setDisplayDeleteAssignmentSuccess
  ] = useState<boolean>(false);
  const [displayCreateScore, setDisplayCreateScore] = useState<boolean>(false); // uses assignedStudents
  const [displayGrade, setDisplayGrade] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>(
    "fa8fde11-43df-4328-9939-58b56309d20d"
  );


  const putGrades = async (assignmentId: string) => {
    /* Example instructor submiting grade for student */
    const results = submitInstructorGrade(new InstructorSubmitGradeParams({
      lineItemId: assignmentId,
      grade: grade,
      userId: selectValue,
      comment: "Instructor comment on the student performance",
      activityProgress: "Completed",
      gradingProgress: "FullyGraded"
    }))

    setDisplayCreateScoreSuccess(true);
    setDisplayGrade(false);
    setDisplayCreateScore(false);
    setDisplayUnAssignedStudents(false);
    setDisplayDeleteAssignmentSuccess(false);

  };
  const deleteAssignment = (assignmentId: string) => {
    /* Example deleting a line item */
    deleteLineItem(assignmentId)
    setDisplayDeleteAssignmentSuccess(true);
    setDisplayUnAssignedStudents(false);
    setDisplayCreateScore(false);
    setDisplayCreateScoreSuccess(false);
  };
  const unassignedStudents = async (
    assignmentId: string,
    resourceLinkId: string
  ) => {

     /* Example getting unassigned students in for a particular assignment */
    const unassignedStudents = await retrieveUnassignedStudents(assignmentId, resourceLinkId);

    setUnassigned(unassignedStudents);
    setDisplayUnAssignedStudents(true);
    setDisplayGrade(false);
    setDisplayCreateScore(false);
    setDisplayDeleteAssignmentSuccess(false);
    setDisplayCreateScoreSuccess(false);

  };
  const grades = async (assignmentId: string) => {

    /* Example getting grades for an assignment */
    const grades = await retrieveGrades(assignmentId);

    setScores(grades);
    setDisplayGrade(true);
    setDisplayUnAssignedStudents(false);
    setDisplayDeleteAssignmentSuccess(false);
    setDisplayCreateScore(false);
    setDisplayCreateScoreSuccess(false);

  };

  const assignedStudents = async (assignmentId: string,
    resourceLinkId: string) => {
    const assigned = await retrieveAssignedStudents(assignmentId, resourceLinkId);
    setAssigned(assigned)
    setDisplayGrade(false);
    setDisplayCreateScore(true);
    setDisplayCreateScoreSuccess(false);
    setDisplayUnAssignedStudents(false);
  };

  return (
    <div className="card assignment" assignment-id={assignmentData.id}>
      <h5 className="card-header">Assignment - {index + 1}</h5>
      <div className="card-body">
        <h5 className="card-title">{assignmentData.label}</h5>
        <p className="card-text">
          {" "}
          Maximum Score: {assignmentData.scoreMaximum} <br /> Tag:{" "}
          {assignmentData.tag}
        </p>
        <div className="btn-group">
          <button
            assignment-id={assignmentData.id}
            className="btn btn-primary assignmentbutton"
            onClick={() => assignedStudents(assignmentData.id,
              assignmentData.resourceLinkId)}
          >
            Submit Grades
          </button>
          <button
            assignment-id={assignmentData.id}
            className="btn btn-primary"
            onClick={() => grades(assignmentData.id)}
          >
            Get Grades
          </button>
          <button
            assignment-id={assignmentData.id}
            className="btn btn-primary"
            onClick={() =>
              unassignedStudents(
                assignmentData.id,
                assignmentData.resourceLinkId
              )
            }
          >
            Get Students not assigned to this Assignment
          </button>
        </div>
        <br></br>
        <hr></hr>
        {displayGrade &&
          scores.map((course: any) => {
            return (
              <a
                href="#"
                data-toggle="popover"
                title="Comment"
                data-content={course.comment}
              >
                {course.StudenName} -
                <span className="badge">
                  {course.score ? course.score : "Not Graded"}
                </span>
                <br />
              </a>
            );
          })}
        {displayUnAssignedStudents &&
          unassigned.map((student: any, index: number) => {
            return (
              <div className="form-group">
                {index == 0 && (
                  <h5>Student not assigned to this assignment:</h5>
                )}
                <div className="list-group">
                  <a
                    href="#"
                    className="list-group-item list-group-item-action"
                  >
                    {student.name}
                  </a>
                </div>
              </div>
            );
          })}
        {displayCreateScore && assigned.map((student:any, index: number) => {
          return (
          <div className="card-footer">
            <div className="container">
              <div className="form-group">
                <label className="control-label">Enter Student's Grade:</label>

                <label>Select Student:</label>
                <select
                  value={selectValue}
                  onChange={(event) => {
                    setSelectValue(event.target.value);
                  }}
                  className="form-control"
                  id="sel"
                >

                  <option value={student.id}>
                    {student.name}
                  </option>
                </select>

                <input
                  value={grade}
                  onChange={(event) => {
                    setGrade(parseInt(event.target.value));
                  }}
                  type="number"
                  className="form-control"
                  id="inputGrade"
                  placeholder="Enter grade for Student"
                  name="title"
                ></input>
                <button
                  assignment-id={assignmentData.id}
                  className="btn btn-primary assignmentbutton"
                  onClick={() => putGrades(assignmentData.id)}
                >
                  Submit Grades
                </button>
              </div>
            </div>
          </div>
            );
          })}
        {displayCreateScoreSuccess && (
          <div>
            <div className="alert alert-success">
              <strong>Success!</strong> Grade submitted successfully!!!
            </div>
          </div>
        )}
        {displayDeleteAssignmentSuccess && (
          <div>
            <div className="alert alert-success">
              <strong>Success!</strong> Assignment deleted successfully!!!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteInstructorAssignment;
