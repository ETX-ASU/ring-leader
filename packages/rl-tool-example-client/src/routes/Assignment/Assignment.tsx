import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./Assignment.scss";

const Assignment: React.FC = (props: any) => {
  console.log("props - " + JSON.stringify(props));

  const [scores, setScores] = useState<any[]>([]);

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
      });
  };
  return (
    <div
      className="card"
      assignment-id={props.assignmentData.id}
      external-tool-url={
        props.assignmentData[
          "https://canvas.instructure.com/lti/submission_type"
        ].external_tool_url
      }
      submission-Type={
        props.assignment["https://canvas.instructure.com/lti/submission_type"]
          .type
      }
    >
      <h5 className="card-header">Assignment - {props.index + 1}</h5>
      <div className="card-body">
        <h5 className="card-title">{props.assignmentData.label}</h5>
        <p className="card-text">
          {" "}
          Maximum Score: {props.assignmentData.scoreMaximum} <br /> Tag:{" "}
          {props.assignmentData.tag}
        </p>
        <button
          assignment-id={props.assignmentData.id}
          className="btn btn-primary assignmentbutton"
          onClick={() => putGrades(props.assignmentData.id)}
        >
          Submit Grades
        </button>
        <button
          assignment-id={props.assignmentData.id}
          className="btn btn-primary assignmentbutton"
          onClick={() => grades(props.assignmentData.id)}
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
