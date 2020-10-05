import axios from "axios";
import React, { useState } from "react";
import "./Assignment.scss";

const Assignment: React.FC = (props: any) => {
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
  const [displayCreateScore, setDisplayCreateScore] = useState<boolean>(false);
  const [displayGrade, setDisplayGrade] = useState<boolean>(false);
  const showSubmitGrade = () => {
    setDisplayGrade(false);
    setDisplayCreateScore(true);
    setDisplayCreateScoreSuccess(false);
    setDisplayUnAssignedStudents(false);
  };
  const putGrades = (assignmentId: string) => {
    axios
      .get("/lti-service/putgrades", {
        params: {
          assignmentId: assignmentId,
          grade: grade
        }
      })
      .then((results) => {
        setDisplayCreateScoreSuccess(true);
        console.log(JSON.stringify(results.data));
        setDisplayGrade(false);
        setDisplayCreateScore(false);
        setDisplayUnAssignedStudents(false);
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
        setDisplayCreateScore(false);
        setDisplayCreateScoreSuccess(false);
      });
  };
  return (
    <div
      className="card assignment"
      assignment-id={assignmentData.id}
      external-tool-url={
        assignmentData["https://canvas.instructure.com/lti/submission_type"]
          .external_tool_url
      }
      submission-Type={
        assignmentData["https://canvas.instructure.com/lti/submission_type"]
          .type
      }
    >
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
              </a>
            );
          })}
        {displayUnAssignedStudents &&
          unAssignedStudents.map((student: any, index: number) => {
            return (
              <div className="container">
                <div className="form-group">
                  <h5>Student not assigned to this assignment:</h5>

                  <a href="#">
                    {index + 1}) {student.StudenName}
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
      </div>
    </div>
  );
};

export default Assignment;
