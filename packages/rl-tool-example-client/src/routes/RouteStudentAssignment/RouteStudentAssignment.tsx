import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./RouteStudentAssignment.scss";
import { SubmitGradeParams } from "@asu-etx/rl-shared";
import { submitGrade as grade } from "@asu-etx/rl-client-lib";


const RouteStudentAssignment: React.FC = () => {
  const params = ({} = useParams());

  const [
    displaySubmitAssignmentSuccess,
    setDisplaySubmitAssignmentSuccess
  ] = useState<boolean>(false);
  const submitGrade = async () => {
    const params: SubmitGradeParams = new SubmitGradeParams();
    const gradeResult = await grade(params);
    if (gradeResult) {
      setDisplaySubmitAssignmentSuccess(true);
    } else {
      setDisplaySubmitAssignmentSuccess(false);
    }
  };
  return (
    <div className="route-assignment">
      <div className="card">
        <div className="card-header">Featured</div>
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          <p className="card-text">
            This is a sample assignment page from example tool!!
          </p>
          <button className="btn btn-primary" onClick={submitGrade}>
            Submit Assignment
          </button>
        </div>
      </div>
      <hr></hr>
      {displaySubmitAssignmentSuccess && (
        <div>
          <div className="alert alert-success">
            <strong>Success!</strong> Assignment submitted successfully!!!
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteStudentAssignment;
