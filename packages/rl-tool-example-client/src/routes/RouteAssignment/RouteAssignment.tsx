import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./RouteAssignment.scss";

const RouteAssignment: React.FC = () => {
  const params = ({} = useParams());
  return (
    <div className="route-assignment">
      This is a sample assignment page from example tool!!
      <hr></hr>
    </div>
  );
};

export default RouteAssignment;
