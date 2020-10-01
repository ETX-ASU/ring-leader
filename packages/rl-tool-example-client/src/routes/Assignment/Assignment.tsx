import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./Assignment.scss";

const Assignment: React.FC = (assignment: any, index) => {
  const [
    displayCreateAssignmentSuccess,
    setDisplayCreateAssignmentSuccess
  ] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [displayDiv, setDisplayDiv] = useState<boolean>(true);
  const [displayNoAssignment, setDisplayNoAssignment] = useState<boolean>(
    false
  );
  const [displayCreateAssignment, setDisplayCreateAssignment] = useState<
    boolean
  >(false);
  const [displayAssignment, setdisplayAssignment] = useState<boolean>(false);
  const [radioInputValue, setRadioInputValue] = useState<string>("");

  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [maxScore, setMaxScore] = useState<number>();

  const [courses, setCourses] = useState<any>({});
  const putGrades = (assignmentId: string) => {
    axios
      .get("/lti-service/putgrades", {
        params: {
          assignmentId: assignmentId
        }
      })
      .then((results) => {
        alert("Grade submitted successfully!!!");
        console.log(JSON.stringify(results.data));
        setDisplayDiv(false);
        setDisplayCreateAssignment(false);
        setdisplayAssignment(false);
        setDisplayNoAssignment(false);
        setDisplayCreateAssignmentSuccess(false);
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
        setDisplayDiv(false);
        setDisplayCreateAssignment(false);
        setdisplayAssignment(true);
        setDisplayNoAssignment(false);
        setDisplayCreateAssignmentSuccess(false);
      });
  };

  const getAssignment = () => {
    setDisplayDiv(false);
    setDisplayCreateAssignment(false);
    setDisplayCreateAssignmentSuccess(false);

    axios.get("/lti-service/getassignment").then((results) => {
      console.log(JSON.stringify(results.data));
      if (results.data.length <= 0) {
        setDisplayNoAssignment(true);
        return;
      }
      setAssignments(results.data);
      setdisplayAssignment(true);
    });
  };
  const params = ({} = useParams());
  return (
    <div
      className="card"
      assignment-id={assignment.id}
      external-tool-url={
        assignment["https://canvas.instructure.com/lti/submission_type"]
          .external_tool_url
      }
      submission-Type={
        assignment["https://canvas.instructure.com/lti/submission_type"].type
      }
    >
      <h5 className="card-header">Assignment - {index + 1}</h5>
      <div className="card-body">
        <h5 className="card-title">{assignment.label}</h5>
        <p className="card-text">
          {" "}
          Maximum Score: {assignment.scoreMaximum} <br /> Tag: {assignment.tag}
        </p>
        <button
          assignment-id={assignment.id}
          className="btn btn-primary assignmentbutton"
          onClick={() => putGrades(assignment.id)}
        >
          Submit Grades
        </button>
        <button
          assignment-id={assignment.id}
          className="btn btn-primary assignmentbutton"
          onClick={() => grades(assignment.id)}
        >
          Get Grades
        </button>
        <br></br>
        <hr></hr>
        {scores.map((course: any) => {
          return (
            <a
              href="#"
              data-toggle="popover"
              title="Comment"
              data-content={course.comment}
            >
              {course.StudenName} -
              <span className="badge"> {course.score}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Assignment;
