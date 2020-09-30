import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./RouteAssignment.scss";

const RouteAssignment: React.FC = () => {
  const params = ({} = useParams());
  console.log("params - " + params);

  return (
    <div className="route-assignment">
      <h1>Assignment Route</h1>
      <hr></hr>
    </div>
  );
};

export default RouteAssignment;
