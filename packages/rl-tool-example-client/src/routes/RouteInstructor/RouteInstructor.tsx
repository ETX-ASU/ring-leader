import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import './RouteInstructor.scss';

const RouteInstructor: React.FC = () => {

  const { } = useParams();

  return (
    <div className="route-instructor">
      <h1>Instructor Route</h1>
    </div>
  );
};

export default RouteInstructor;