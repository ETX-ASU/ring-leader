import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./RouteAssignment.scss";

const RouteAssignment: React.FC = () => {
  const {} = useParams();

  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const getUsers = () => {
    axios.get("/lti-service/roster").then((results) => {
      console.log(JSON.stringify(results));
      setUsers(results.data.members);
      setCourses(results.data.context);
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
            {courses.map((course, index) => {
              return <div key="index">{JSON.stringify(course)}</div>;
            })}
            {users.map((user, index) => {
              return (
                <div key="index">
                  <ul className="li">{user.name}</ul>
                  <ul className="li">{user.picture}</ul>
                  <ul className="li">{user.given_name}</ul>
                  <ul className="li">{user.family_name}</ul>
                  <ul className="li">{user.email}</ul>
                  <ul className="li">{user.user_id}</ul>
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
