import axios from "axios";
import React, { useState } from "react";
import "./RouteInstructorAssignment.scss";

const RouteInstructorAssignment: React.FC = (props: any) => {
  console.log("props - " + JSON.stringify(props));
  const assignmentData = props["data-assignmentData"];
  console.log("assignmentData - json - " + JSON.stringify(assignmentData));
  const index = props["data-index"];
  console.log("assignmentData id- " + assignmentData.id);
  console.log("index - " + index);
  const [scores, setScores] = useState<any[]>([]);
  const [unAssignedStudents, setUnAssignedStudents] = useState<any[]>([]);
  const [grade, setGrade] = useState<number>();
  const [displayCreateScoreSuccess, setDisplayCreateScoreSuccess] = useState<
    boolean
  >(false);

  const [displayUnAssignedStudents, setDisplayUnAssignedStudents] = useState<
    boolean
  >(false);
  const [
    displayDeleteAssignmentSuccess,
    setDisplayDeleteAssignmentSuccess
  ] = useState<boolean>(false);
  const [displayCreateScore, setDisplayCreateScore] = useState<boolean>(false);
  const [displayGrade, setDisplayGrade] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>(
    "fa8fde11-43df-4328-9939-58b56309d20d"
  );

  const showSubmitGrade = () => {
    setDisplayGrade(false);
    setDisplayCreateScore(true);
    setDisplayCreateScoreSuccess(false);
    setDisplayUnAssignedStudents(false);
  };

  const putGrades = (assignmentId: string) => {
    axios
      .post("/lti-service/putGrade", {
        params: {
          lineItemId: assignmentId,
          grade: grade,
          userId: selectValue,
          comment: "Instructor comment on the student performance",
          activityProgress: "Completed",
          gradingProgress: "FullyGraded"
        }
      })
      .then((results) => {
        setDisplayCreateScoreSuccess(true);
        console.log(JSON.stringify(results.data));
        setDisplayGrade(false);
        setDisplayCreateScore(false);
        setDisplayUnAssignedStudents(false);
        setDisplayDeleteAssignmentSuccess(false);
      });
  };
  const deleteAssignment = (assignmentId: string) => {
    axios
      .delete("/lti-service/deleteLineItem", {
        params: {
          assignmentId: assignmentId
        }
      })
      .then((results) => {
        console.log(JSON.stringify(results.data));
        setDisplayDeleteAssignmentSuccess(true);
        setDisplayUnAssignedStudents(false);
        setDisplayCreateScore(false);
        setDisplayCreateScoreSuccess(false);
      });
  };
  const getUnAssignedStudets = (assignmentId: string) => {
    axios
      .get("/lti-service/getunassignedstudets", {
        params: {
          assignmentId: assignmentId
        }
      })
      .then((results) => {
        console.log("getUnAssignedStudets-" + JSON.stringify(results.data));
        setUnAssignedStudents(results.data);
        setDisplayUnAssignedStudents(true);
        setDisplayGrade(false);
        setDisplayCreateScore(false);
        setDisplayDeleteAssignmentSuccess(false);
        setDisplayCreateScoreSuccess(false);
      });
  };
  const grades = (assignmentId: string) => {
    axios
      .get("/lti-service/grades", {
        params: {
          assignmentId: assignmentId
        }
      })
      .then((results) => {
        console.log(JSON.stringify(results.data));
        setScores(results.data);
        setDisplayGrade(true);
        setDisplayUnAssignedStudents(false);
        setDisplayDeleteAssignmentSuccess(false);
        setDisplayCreateScore(false);
        setDisplayCreateScoreSuccess(false);
      });
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
            onClick={showSubmitGrade}
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
            onClick={() => deleteAssignment(assignmentData.id)}
          >
            Delete Assignment
          </button>
          <button
            assignment-id={assignmentData.id}
            className="btn btn-primary"
            onClick={() => getUnAssignedStudets(assignmentData.id)}
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
          unAssignedStudents.map((student: any, index: number) => {
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
                    {student.StudenName}
                  </a>
                </div>
              </div>
            );
          })}
        {displayCreateScore && (
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
                  <option value="fa8fde11-43df-4328-9939-58b56309d20d">
                    Devesh Tiwari Student A
                  </option>
                  <option value="50681b1d-72ce-4102-94d6-dc586f9ba43f">
                    Devesh Tiwari Student B
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
        )}
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
