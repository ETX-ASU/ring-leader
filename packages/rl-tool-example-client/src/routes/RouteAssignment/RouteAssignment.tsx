import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import './RouteAssignment.scss';

const RouteAssignment: React.FC = () => {

  const { } = useParams();

  return (
    <div className="route-assignment">
      <h1>Assignment Route</h1>
    </div>
  );
};

export default RouteAssignment;