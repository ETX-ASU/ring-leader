import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./RouteDeepLinking.scss";

const RouteDeepLinking: React.FC = () => {
  const params = ({} = useParams());

  const submitGrade = () => {
    axios.post("/lti-service/deeplink", {
      params: {}
    });
  };
  return (
    <div className="route-assignment">
      <div className="card">
        <div className="card-header">Featured</div>
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          <p className="card-text">
            This is a sample deep linking page from example tool!!
          </p>
          <button className="btn btn-primary" onClick={submitGrade}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDeepLinking;
