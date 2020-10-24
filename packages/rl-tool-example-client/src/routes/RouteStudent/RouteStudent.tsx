import React from "react";
import { useParams } from "react-router-dom";

import "./RouteStudent.scss";

const RouteStudent: React.FC = () => {
  const params = ({} = useParams());

  return (
    <div className="route-assignment">
      <div className="card">
        <div className="card-header">Student view of external tool</div>
        <div className="card-body">
          <p className="card-text">
            This is a sample view page from example tool that will be displayed
            to the student!!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteStudent;
