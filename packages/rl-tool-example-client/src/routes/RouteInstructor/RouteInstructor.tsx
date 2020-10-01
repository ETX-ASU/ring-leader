import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RouteInstructor.scss";
import Assignment from "../Assignment/Assignment";

const RouteInstructor: React.FC = () => {
  const {} = useParams();

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
  const getUsers = () => {
    setDisplayCreateAssignment(false);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
    setDisplayNoAssignment(false);
    axios
      .get("/lti-service/roster", { params: { role: radioInputValue } })
      .then((results) => {
        console.log(JSON.stringify(results));
        setUsers(results.data.members);
        setCourses(results.data.context);
        console.log(JSON.stringify(users));
        console.log(JSON.stringify(courses));
        setDisplayDiv(true);
      });
  };
  const createAssignment = () => {
    axios
      .get("/lti-service/createassignment", {
        params: {
          scoreMaximum: maxScore,
          label: title,
          tag: tag
        }
      })
      .then((results) => {
        console.log(JSON.stringify(results.data));
        setDisplayDiv(false);
        setDisplayCreateAssignment(false);
        setdisplayAssignment(false);
        setDisplayNoAssignment(false);
        setDisplayCreateAssignmentSuccess(true);
      });
  };

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
  const handleCheck = (event: any): any => {
    setRadioInputValue(event.target.value);
    setDisplayDiv(false);
    setDisplayNoAssignment(false);
    setDisplayCreateAssignment(false);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
  };

  const handleCreateAssigment = (event: any): any => {
    setDisplayDiv(false);
    setDisplayCreateAssignment(true);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
    setDisplayNoAssignment(false);
  };
  return (
    <div className="route-instructor">
      <h3>
        {courses.title && (
          <>
            <div key="index">
              <h3>Course Title - {JSON.stringify(courses.title)}</h3>
            </div>
            <hr></hr>
          </>
        )}
      </h3>
      <div className="row">
        <div className="col">
          <div className="form-check-inline">
            <label className="form-check-label">
              <input
                onChange={handleCheck}
                type="radio"
                value="Learner"
                className="form-check-input"
                name="optradio"
              ></input>
              Learner
            </label>

            <label className="form-check-label">
              <input
                onChange={handleCheck}
                type="radio"
                value="Instructor"
                className="form-check-input"
                name="optradio"
              ></input>
              Instructor
            </label>

            <button className="btn btn-primary" onClick={getUsers}>
              Get Member Details
            </button>
            <button className="btn btn-primary" onClick={getAssignment}>
              Get Assignments
            </button>
            <button className="btn btn-primary" onClick={handleCreateAssigment}>
              Create Assignment
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col details">
          {displayDiv &&
            users.map((user, index) => {
              return (
                <div className="userprofile card" key={user.user_id}>
                  <img
                    className="card-img-top"
                    src={user.picture}
                    alt="Card image cap"
                  ></img>
                  <div className="card-body">
                    <h5 className="card-title">
                      {user.name} ({user.email})
                    </h5>
                    <p className="card-text">
                      Email - {user.email} <br /> Role - {radioInputValue}
                    </p>
                  </div>
                </div>
              );
            })}
          {displayCreateAssignment && (
            <div className="container">
              <div className="form-group">
                <label className="control-label">Assignment Title:</label>
                <input
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter Assignment Title"
                  name="title"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Maximum Score:</label>

                <input
                  value={maxScore}
                  onChange={(event) => {
                    setMaxScore(parseInt(event.target.value));
                  }}
                  type="number"
                  className="form-control"
                  id="MaximumScore"
                  placeholder="Enter Maximum Score"
                  name="MaximumScore"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Tag:</label>
                <input
                  value={tag}
                  onChange={(event) => {
                    setTag(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  id="Tag"
                  placeholder="Enter Tag"
                  name="Tag"
                ></input>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button
                    type="submit"
                    onClick={createAssignment}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
          {displayCreateAssignmentSuccess && (
            <div>
              <div className="alert alert-success">
                <strong>Success!</strong> Assignment created successfully!!!
              </div>
            </div>
          )}
          {displayAssignment &&
            assignments.map((assignment, index) => {
              return (
                <Assignment
                  data-index={index}
                  data-assignmentData={assignment}
                ></Assignment>
              );
            })}
          {displayNoAssignment && (
            <div>
              <div className="alert alert-info">
                <strong>Info!</strong> You do not have any assignment at the
                moment!!!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteInstructor;
