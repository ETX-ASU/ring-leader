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
      .get("/lti-service/deeplink", {
        params: {
          title: "Chapter 12 quiz",
          url: "https://something.example.com/page.html",
          resourceId: radioInputValue,
          lineItem: {
            scoreMaximum: 87,
            label: "Chapter 12 quiz",
            resourceId: "xyzpdq1234",
            tag: "originality"
          }
        }
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
