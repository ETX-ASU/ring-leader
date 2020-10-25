import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RouteInstructor.scss";
import RouteInstructorAssignment from "../RouteInstructorAssignment/RouteInstructorAssignment";
import { logger } from "@asu-etx/rl-shared";
import { getUsers as retrieveUsers, getLineItems } from "@asu-etx/rl-client-lib";
import SubmitAssignment from "../../model/SubmitAssignment";
import { createAssignment as insertExampleAssignment } from "../../services/AssignmentService";

const RouteInstructor: React.FC = (props: any) => {
  const { } = useParams();
  logger.debug("useParams - " + JSON.stringify(useParams()));
  const [
    displayCreateAssignmentSuccess,
    setDisplayCreateAssignmentSuccess
  ] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [displayDiv, setDisplayDiv] = useState<boolean>(true);
  const [
    displayCreateResourceLinkAssignment,
    setDisplayCreateResourceLinkAssignment
  ] = useState<boolean>(false);
  const [displayNoAssignment, setDisplayNoAssignment] = useState<boolean>(
    false
  );
  const [displayCreateAssignment, setDisplayCreateAssignment] = useState<
    boolean
  >(false);
  const [displayAssignment, setdisplayAssignment] = useState<boolean>(false);
  const [radioInputValue, setRadioInputValue] = useState<string>("");

  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [resourceId, setResourceId] = useState<string>("");
  const [maxScore, setMaxScore] = useState<number>();

  const [courses, setCourses] = useState<any>({});
  const getUsers = async () => {
    setDisplayCreateAssignment(false);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
    setDisplayNoAssignment(false);
    setDisplayCreateResourceLinkAssignment(false);

    /* EXAMPLE: How to retrieve users */
    const results = await retrieveUsers(radioInputValue);
    setUsers(results.members);
    setCourses(results.context);
    setDisplayDiv(true);
  };
  const createAssignment = async () => {
    
    /* EXAMPLE: example creating assignment only for this example client */
    const results: any = await insertExampleAssignment(new SubmitAssignment({
      scoreMaximum: maxScore,
      label: title,
      tag: tag,
      resourceId: resourceId
    }));
    setDisplayDiv(false);
    setDisplayCreateAssignment(false);
    setdisplayAssignment(false);
    setDisplayNoAssignment(false);
    setDisplayCreateAssignmentSuccess(true);

  };

  const getAssignment = async () => {
    setDisplayDiv(false);
    setDisplayCreateAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
    

    /* EXAMPLE: example how to retrieve line items */
    const results: any[] = await getLineItems();
    if (results.length <= 0) {
      setDisplayNoAssignment(true);
      return;
    }
    setAssignments(results);
    setdisplayAssignment(true);
  };
  const handleCheck = (event: any): any => {
    setRadioInputValue(event.target.value);
    setDisplayDiv(false);
    setDisplayNoAssignment(false);
    setDisplayCreateAssignment(false);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
  };

  const handleCreateAssigment = (event: any): any => {
    setDisplayDiv(false);
    setDisplayCreateAssignment(true);
    setdisplayAssignment(false);
    setDisplayCreateAssignmentSuccess(false);
    setDisplayNoAssignment(false);
  };

  return (
    <div className="route-instructor">
      <h3>
        {courses.title && (
          <>
            <div key="index">
              <h3>Course Title - {JSON.stringify(courses.title)}</h3>
            </div>
            <hr></hr>
          </>
        )}
      </h3>
      <div className="row">
        <div className="col">
          <div className="form-check-inline">
            <label className="form-check-label">
              <input
                onChange={handleCheck}
                type="radio"
                value="Learner"
                className="form-check-input"
                name="optradio"
              ></input>
              Learner
            </label>

            <label className="form-check-label">
              <input
                onChange={handleCheck}
                type="radio"
                value="Instructor"
                className="form-check-input"
                name="optradio"
              ></input>
              Instructor
            </label>

            <button className="btn btn-primary" onClick={getUsers}>
              Get Member Details
            </button>
            <button className="btn btn-primary" onClick={getAssignment}>
              Get Assignments
            </button>
            <button className="btn btn-primary" onClick={handleCreateAssigment}>
              Create Assignment
            </button>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col">
          <div className="details">
            {displayDiv &&
              users.map((user, index) => {
                return (
                  <div className="userprofile card" key={user.user_id}>
                    <img
                      className="card-img-top"
                      src={user.picture}
                      alt="Card image cap"
                    ></img>
                    <div className="card-body">
                      <h5 className="card-title">
                        {user.name} ({user.email})
                      </h5>
                      <p className="card-text">
                        Email - {user.email} <br /> Role - {radioInputValue}
                      </p>
                    </div>
                  </div>
                );
              })}{" "}
          </div>

          {displayCreateAssignment && (
            <div className=" container">
              <div>
                <div className="alert alert-info">
                  <strong>Info!</strong> <strong>Resource Id -</strong>This will
                  be appended as query string parameter in URL during assignment
                  view. Tool can check this parameter and identify which content
                  to show. e.g. quiz-id-101)
                </div>
              </div>
              <div className="form-group">
                <label className="control-label">Resource Id :</label>
                <input
                  value={resourceId}
                  onChange={(event) => {
                    setResourceId(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  id="Tag"
                  placeholder="Enter Resource Id"
                  name="Tag"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Assignment Title:</label>
                <input
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter Assignment Title"
                  name="title"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Maximum Score:</label>

                <input
                  value={maxScore}
                  onChange={(event) => {
                    setMaxScore(parseInt(event.target.value));
                  }}
                  type="number"
                  className="form-control"
                  id="MaximumScore"
                  placeholder="Enter Maximum Score"
                  name="MaximumScore"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Tag:</label>
                <input
                  value={tag}
                  onChange={(event) => {
                    setTag(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  id="Tag"
                  placeholder="Enter Tag"
                  name="Tag"
                ></input>
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  onClick={createAssignment}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          )}
          {displayCreateAssignmentSuccess && (
            <div>
              <div className="alert alert-success">
                <strong>Success!</strong> Assignment created successfully!!!
              </div>
            </div>
          )}
          {displayAssignment &&
            assignments.map((assignment, index) => {
              return (
                <RouteInstructorAssignment
                  data-index={index}
                  data-assignmentData={assignment}
                ></RouteInstructorAssignment>
              );
            })}
          {displayNoAssignment && (
            <div>
              <div className="alert alert-info">
                <strong>Info!</strong> You do not have any assignment at the
                moment!!!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteInstructor;
