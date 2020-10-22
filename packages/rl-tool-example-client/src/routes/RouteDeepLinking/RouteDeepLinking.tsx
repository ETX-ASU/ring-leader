import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RouteDeepLinking.scss";
import {DEEP_LINK_RESOURCELINKS_ENDPOINT} from "@asu-etx/rl-shared";
import $ from "jquery";

//const DEEP_LINK_RESOURCELINKS_ENDPOINT = "/lti-service/getDeepLinkAssignments";
console.log(`deeplink ${DEEP_LINK_RESOURCELINKS_ENDPOINT}`);
const DEEP_LINK_ASSIGNMENT_ENDPOINT = "/lti-service/deeplink";
const RouteDeepLinking: React.FC = () => {
  const [resourceLink, setResourceLink] = useState<{}>({});
  const [assignments, setAssignments] = useState<any[]>([]);
  const handleCheck = (resourceLinkData: any): any => {
    setResourceLink(resourceLinkData);
  };
  useEffect(() => {
    getDeepLinkResourceLinks();
  });
  const getDeepLinkResourceLinks = () => {
    console.log(`hitting endpoint GET:${DEEP_LINK_RESOURCELINKS_ENDPOINT}`);
    axios.get(DEEP_LINK_RESOURCELINKS_ENDPOINT).then((results) => {
      console.log(JSON.stringify(results.data));
      setAssignments(results.data);
    });
  };
  const submitResourceSelection = () => {
    console.log(`hitting endpoint POST:${DEEP_LINK_ASSIGNMENT_ENDPOINT}`);
    axios
      .post(DEEP_LINK_ASSIGNMENT_ENDPOINT, {
        contentItems: [resourceLink]
      })
      .then((result) => {
        console.log(result);

        $("body").append(result.data);
      });
  };
  return (
    <div className="route-assignment">
      <div className="card">
        <div className="card-body">
          {assignments.map((assignment, index) => {
            return (
              <div className="radio">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <input
                        onChange={() => handleCheck(assignment)}
                        type="radio"
                      ></input>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    name="optradio"
                    placeholder={assignment.title}
                  ></input>
                </div>
              </div>
            );
          })}

          <button className="btn btn-primary" onClick={submitResourceSelection}>
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDeepLinking;
