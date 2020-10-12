import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RouteDeepLinking.scss";
import $ from "jquery";

const RouteDeepLinking: React.FC = () => {
  const [radioInputValue, setRadioInputValue] = useState<string>("");
  const handleCheck = (event: any): any => {
    setRadioInputValue(event.target.value);
  };
  const submitGrade = () => {
    axios
      .post("/lti-service/deeplink", {
        contentItems: [
          {
            type: "ltiResourceLink",
            title: "Chapter 12 quiz",
            url:
              "https://ring-leader-devesh-tiwari.herokuapp.com/assignment?resourceId=" +
              radioInputValue,
            resourceId: radioInputValue,
            lineItem: {
              scoreMaximum: 100,
              label: "Chapter 12 quiz",
              resourceId: radioInputValue,
              tag: "originality"
            },
            available: {
              startDateTime: "2020-10-06T20:05:02Z",
              endDateTime: "2020-10-30T20:05:02Z"
            },
            submission: {
              endDateTime: "2020-10-30T20:05:02Z"
            },
            custom: {
              quiz_id: "az-123",
              duedate: "2020-10-30T20:05:02Z"
            }
          }
        ]
      })
      .then((result) => {
        console.log(result);

        $("body").append(result.data);
      });
  };
  return (
    <div className="route-assignment">
      <div className="card">
        <div className="card-header">Assignment list</div>
        <div className="card-body">
          <div className="radio">
            <label>
              <input
                onChange={handleCheck}
                type="radio"
                value="Learner"
                name="optradio"
              ></input>
              Math's Assignment - 1
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" name="optradio" />
              Math's Assignment - 2
            </label>
          </div>
          <button className="btn btn-primary" onClick={submitGrade}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDeepLinking;
