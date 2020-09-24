import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./RouteAssignment.scss";

const RouteAssignment: React.FC = () => {
  const {} = useParams();

  const [users, setUsers] = useState<any[]>([]);
  const [radioInputValue, setradioInputValue] = useState<string>("both");
  const [courses, setCourses] = useState<any>({});
  const getUsers = () => {
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
  const handleCheck = (event: any): any => {
    setradioInputValue(event.target.value);
  };
  return (
    <div className="route-assignment">
      <h1>Assignment Route</h1>
      <hr></hr>
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
              Student
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
          <div className="form-check-inline">
            <label className="form-check-label">
              <input
                onChange={handleCheck}
                type="radio"
                value="both"
                className="form-check-input"
                name="optradio"
              ></input>
              Both
            </label>
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={getUsers}>
              Get Details from Platform
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {courses.title && (
              <>
                <div key="index">
                  <h2>Course Title - {JSON.stringify(courses.title)}</h2>
                </div>
                <hr></hr>
              </>
            )}
            {users.map((user, index) => {
              return (
                <div className="userprofile" key="index">
                  <h2>Members - {index + 1}</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteAssignment;
