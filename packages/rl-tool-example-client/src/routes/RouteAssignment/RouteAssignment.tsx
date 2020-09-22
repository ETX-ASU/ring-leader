import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./RouteAssignment.scss";

const RouteAssignment: React.FC = () => {
  const {} = useParams();

  const [users, setUsers] = useState([]);
  const [courseDetails, setcourseDetails] = useState([]);
  const getUsers = () => {
    axios.get("/lti-service/roster").then((results) => {
      console.log(JSON.stringify(results));
      setUsers(results.data.members);
      setcourseDetails(results.data.context);
    });
  };
  const getAccessToken = () => {
    axios.get("/lti-service/accesstoken").then((results) => {
      console.log(JSON.stringify(results));
      alert("Access Token -" + JSON.stringify(results.data));
    });
  };
  return (
    <div className="route-assignment">
      <h1>Assignment Route</h1>
      <div className="container">
        <div className="row">
          <div className="col">
            <button className="btn btn-primary" onClick={getAccessToken}>
              Get Access Token
            </button>
            <button className="btn btn-primary" onClick={getUsers}>
              Get Users
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {<div key="index">{JSON.stringify(courseDetails)}</div>}
            {users.map((user, index) => {
              return <div key="index">{JSON.stringify(user)}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteAssignment;
