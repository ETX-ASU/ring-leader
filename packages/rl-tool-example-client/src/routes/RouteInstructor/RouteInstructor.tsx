import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./RouteInstructor.scss";

const RouteInstructor: React.FC = () => {
  const {} = useParams();

  const [
    displayCreateAssignmentSuccess,
    setDisplayCreateAssignmentSuccess
  ] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [displayDiv, setDisplayDiv] = useState<boolean>(true);
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
    setDisplayDiv(true);
    setDisplayCreateAssignment(false);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
    axios
      .get("/lti-service/roster", { params: { role: radioInputValue } })
      .then((results) => {
        console.log(JSON.stringify(results));
        setUsers(results.data.members);
        setCourses(results.data.context);
        console.log(JSON.stringify(users));
        console.log(JSON.stringify(courses));
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
        setDisplayCreateAssignmentSuccess(true);
      });
  };

  const getAssignment = () => {
    setDisplayDiv(false);
    setDisplayCreateAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
    axios.get("/lti-service/getassignment").then((results) => {
      setdisplayAssignment(true);
      console.log(JSON.stringify(results.data));
      if (results.data.length <= 0) alert("No Assignment to display");
      setAssignments(results.data);
    });
  };
  const handleCheck = (event: any): any => {
    setRadioInputValue(event.target.value);
    setDisplayDiv(false);
    setDisplayCreateAssignment(false);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
  };

  const handleCreateAssigment = (event: any): any => {
    setDisplayDiv(false);
    setDisplayCreateAssignment(true);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
  };
  return (
    <div className="route-instructor">
      <h3>
        Instructor Route
        {courses.title && (
          <>
            <div key="index">
              <h3>Course Title - {JSON.stringify(courses.title)}</h3>
            </div>
            <hr></hr>
          </>
        )}
      </h3>
      <div className="container">
        <div className="row">
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
          </div>
          <div className="form-check-inline">
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
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={getUsers}>
              Get Details from Platform
            </button>
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={handleCreateAssigment}>
              Create Assignment
            </button>
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={getAssignment}>
              Get Assignments
            </button>
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <div className="col">
            {displayDiv &&
              users.map((user, index) => {
                return (
                  <div className="userprofile" key="index">
                    <h2>
                      {radioInputValue} - {index + 1}
                    </h2>
                    <ul className="li">
                      Profile Pic:
                      <img src={user.picture}></img>
                    </ul>
                    <ul className="li">Name : {user.name}</ul>
                    <ul className="li">Given Name: {user.given_name}</ul>
                    <ul className="li">Family Name: {user.family_name}</ul>
                    <ul className="li">Email: {user.email}</ul>
                    <ul className="li">User Id: {user.user_id}</ul>
                    <ul className="li">Roles: {JSON.stringify(user.roles)}</ul>
                  </div>
                );
              })}
            {displayCreateAssignment && (
              <div>
                <div className="form-group">
                  <label className="control-label col-sm-2">
                    Assignment Title:
                  </label>
                  <div className="col-sm-10">
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
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-2">
                    Maximum Score:
                  </label>
                  <div className="col-sm-10">
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
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-2">Tag:</label>
                  <div className="col-sm-10">
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
              (assignments.map((assignment, index) => {
                return (
                  <div className="userprofile" key="index">
                    <h2>Assignment - {index + 1}</h2>
                    <ul className="li">Id: {assignment.id}</ul>
                    <ul className="li">Label : {assignment.label}</ul>
                    <ul className="li">
                      Maximum Score: {assignment.scoreMaximum}
                    </ul>
                    <ul className="li">Tag: {assignment.tag}</ul>
                    <ul className="li">
                      Submission Type:{" "}
                      {
                        assignment[
                          "https://canvas.instructure.com/lti/submission_type"
                        ].type
                      }
                    </ul>
                    <ul className="li">
                      External Tool Url:
                      {
                        assignment[
                          "https://canvas.instructure.com/lti/submission_type"
                        ].external_tool_url
                      }
                    </ul>
                  </div>
                );
              }) ||
                (assignments.length <= 0 && (
                  <div>
                    <div className="alert alert-info">
                      <strong>Info!</strong> You do not have any assignment at
                      the moment!!!
                    </div>
                  </div>
                )))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteInstructor;
