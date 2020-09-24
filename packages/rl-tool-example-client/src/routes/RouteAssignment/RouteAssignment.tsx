import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./RouteAssignment.scss";

const RouteAssignment: React.FC = () => {
  const {} = useParams();

  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any>({});
  const getUsers = () => {
    axios.get("/lti-service/roster").then((results) => {
      console.log(JSON.stringify(results));
      setUsers(results.data.members);
      setCourses(results.data.context);
      console.log(JSON.stringify(users));
      console.log(JSON.stringify(courses));
    });
  };
  return (
    <div className="route-assignment">
      <h1>Assignment Route</h1>
      <div className="container">
        <div className="row">
          <div className="col">
            <button className="btn btn-primary" onClick={getUsers}>
              Get Users
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div key="index">
              <h1>Course Title - {JSON.stringify(courses.title)}</h1>
            </div>

            {users.map((user, index) => {
              return (
                <div key="index">
                  <h2>Members - {index}</h2>
                  <ul className="li">name : {user.name}</ul>
                  <ul className="li">
                    Profile Pic:
                    <img src={user.picture}></img>
                  </ul>
                  <ul className="li">given_name: {user.given_name}</ul>
                  <ul className="li">family_name: {user.family_name}</ul>
                  <ul className="li">email: {user.email}</ul>
                  <ul className="li">user_id: {user.user_id}</ul>
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
