import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RouteDeepLinking.scss";
import {getDeepLinkResourceLinks as getLinks, submitResourceSelection as submitSelection} from "@asu-etx/rl-client-lib";
import $ from "jquery";
import { SubmitContentItem } from "@asu-etx/rl-shared";

const RouteDeepLinking: React.FC = () => {
  const [resourceLink, setResourceLink] = useState<SubmitContentItem>(new SubmitContentItem(null));
  const [assignments, setAssignments] = useState<any[]>([]);
  const handleCheck = (resourceLinkData: any): any => {
    setResourceLink(resourceLinkData);
  };
  useEffect(() => {
    getDeepLinkResourceLinks();
  });
  const getDeepLinkResourceLinks = async () => {
    /* EXAMPLE: how to get the set of deep links previously created in canvas */
    const assignments = await getLinks();
    setAssignments(assignments);
  };
  const submitResourceSelection = async () => {

    /* EXAMPLE: example how to create a deep link with a line item in canvas with a resource link */
    const data = await submitSelection(resourceLink);
    $("body").append(data);
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
