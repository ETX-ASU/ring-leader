import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RouteDeepLinking.scss";
import $ from "jquery";

const RouteDeepLinking: React.FC = () => {
  const [resourceLink, setResourceLink] = useState<{}>({});
  const [assignments, setAssignments] = useState<any[]>([]);
  const handleCheck = (resourceLinkData: any): any => {
    setResourceLink(resourceLinkData);
  };

  const getDeepLinkResourceLinks = () => {
    axios.get("/lti-service/getDeepLinkAssignments").then((results) => {
      console.log(JSON.stringify(results.data));
      setAssignments(results.data);
    });
  };
  const submitGrade = () => {
    axios
      .post("/lti-service/deeplink", {
        contentItems: [resourceLink]
      })
      .then((result) => {
        console.log(result);

        $("body").append(result.data);
      });
  };
  getDeepLinkResourceLinks();
  return (
    <div className="route-assignment">
      <div className="card">
        <div className="card-header">Assignment list</div>
        <div className="card-body">
          {assignments.map((assignment, index) => {
            return (
              <div className="radio">
                <label>
                  <input
                    onChange={() => handleCheck(assignment)}
                    type="radio"
                    value="Learner"
                    name="optradio"
                  ></input>
                  {assignment.title}
                </label>
              </div>
            );
          })}

          <button className="btn btn-primary" onClick={submitGrade}>
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDeepLinking;
