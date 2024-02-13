import React, { useEffect, useState } from "react";
import { TabContent, TabPane } from "reactstrap";
import {
  getCertificateForPOS,
  getExamResult,
  handleEndExam,
  handlePostAnswer,
  handleStartExam,
  sendErrorMessage,
} from "../services/posServices";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cookie from "react-cookies";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveUserDetails } from "../../store/actions/userAction";
import axios from "axios";
const PosExam = () => {
  const userDetails = useSelector(
    (state) => state?.root?.userDetails?.addedPos?.posId
  );
  const [startExam, setStartExam] = React.useState(false);
  const navigate = useNavigate();
  const [correctOption, setCorrectOption] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = React.useState([]);
  const [result, setResult] = useState(null);
  const [callApi, setCallApi] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const [answerStatus, setAnswerStatus] = useState({
    toggleButton: [],
    notansered: 0,
    answered: 0,
    skipped: 0,
  });
  const handleActiveTab = (val) => {
    setActiveTab(val);
  };
  useEffect(() => {
    if (startExam === true && answerStatus.answered === questions.length) {
      handleEndExam().then((response) => {
        if (response.status === true) {
          getExamResult();
          console.log(response);
        } else {
          console.log(response);
        }
      });
      setCallApi(true);
      // setStartExam(false);
    }
  }, [answerStatus.answered]);

  useEffect(() => {
    if (callApi === true) {
      getExamResult().then((response) => {
        if (response?.status === true) {
          setResult(response);
        } else if (response?.result === "fail") {
          startTheExam();
        }
      });
      setCallApi(false);
    }
  }, [callApi]);

  const handleChangeCorrentOption = (val) => {
    setCorrectOption(val);
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const submitQuesion = (id, type, index) => {
    if (correctOption == "" && type === 2) {
      return setErrorMessage("Please choose a right option");
    }
    let postData;
    let answerStat = [...answerStatus.toggleButton];
    if (type === 1) {
      postData = {
        question: id,
        given_answer: "skipped",
      };
      answerStat[index] = "skipped";
    } else if (type === 2) {
      postData = {
        question: id,
        given_answer: correctOption,
      };
      answerStat[index] = "disabled";
    }
    setAnswerStatus({
      ...answerStatus,
      toggleButton: answerStat,
      ...(type === 2
        ? {
            answered: answerStatus.answered + 1,
            notansered: answerStatus.notansered - 1,
          }
        : { skipped: answerStatus.skipped + 1 }),
    });
    handlePostAnswer(postData)
      .then((response) => {
        if (response.status === true) {
          setErrorMessage("");
          setCorrectOption("");
          if (activeTab + 1 < questions.length) {
            setActiveTab(activeTab + 1);
          }
          // if (activeTab + 1 === questions.length) {
          //   setCallApi(true);
          //   setStartExam(false);
          // }
        } else {
          setActiveTab(activeTab + 1);
          // if (activeTab + 1 === questions.length) {
          //   setCallApi(true);
          //   setStartExam(false);
          // }
          sendErrorMessage(response);
        }
      })
      .catch((error) => console.log(error));
  };

  const startTheExam = () => {
    handleStartExam().then((response) => {
      if (response.status === true) {
        setQuestions(response.data.questions);
        setAnswerStatus({
          ...answerStatus,
          toggleButton: Array(response.data.questions.length).fill(""),
          notansered: response.data.questions.length,
        });
        setStartExam(true);
      } else {
        // sendErrorMessage(response);
      }
    });
  };

  useEffect(() => {
    return () => {
      handleEndExam().then((response) => {
        if (response.status === true) {
          getExamResult();
          console.log(response);
        } else {
          console.log(response);
        }
      });
    };
  }, []);

  const ClearUserData = () => {
    return new Promise((resolve, reject) => {
      cookie.remove("userDetails");
      cookie.remove("postoken");

      dispatch(saveUserDetails({}));
      resolve("done");
    });
  };

  const logotu = () => {
    ClearUserData().then((res) => {
      navigate("/");
    });
  };

  const downloadPdf = async () => {
    try {
      const response = await axios.get(
        `https://api.flaskitsolutions.com/api/v1/exam/certificate/${userDetails}`,
        {
          responseType: "blob",
        }
      );
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "Certificate.pdf";
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <section className="trainingSection">
      {/*----- Blur set effect -----*/}
      <div className="blur-bg-blocks">
        <aside className="blur-bg-set">
          <div className="blur-bg blur-bg-a" />
          <div className="blur-bg blur-bg-b" />
          <div className="blur-bg blur-bg-c" />
        </aside>
      </div>
      {/*----- container start -----*/}
      <div className="container-lg container-fluid">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-8 col-12 text-center mx-auto my-lg-3 py-3">
            <h1 className="text-capitalize about-heading mx-auto">
              FIT Insurance PosP Exam
            </h1>
          </div>

          <div className="col-12">
            <section className="PosExaMSection">
              <div className="card border-0 shadow-lg px-lg-3 py-3">
                <div className="card-body">
                  {/* <h2 className="text-decoration-underline mb-4">Remaining :- <time>10:20 Min</time></h2> */}
                  {/*------ Exam Portal Design Start ----- */}
                  {result != null && (
                    <div className="card">
                      <div className="card-header p-3">
                        <h2 className="m-0 fs-3">
                          {result?.data?.exam?.title} Result
                        </h2>
                      </div>

                      <div className="card-body p-lg-5">
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <tbody>
                              <tr>
                                <th className="p-3 fs-4">Total Question</th>
                                <td className="p-3 fs-4">
                                  {result?.data?.total_questions}
                                </td>
                              </tr>

                              <tr>
                                <th className="p-3 fs-4">
                                  Total Correct Answer
                                </th>
                                <td className="p-3 fs-4">
                                  {result?.data?.correct}
                                </td>
                              </tr>

                              <tr>
                                <th className="p-3 fs-4">
                                  Total Incorrect Answer
                                </th>
                                <td className="p-3 fs-4">
                                  {result?.data?.inCorrect}
                                </td>
                              </tr>

                              <tr>
                                <th className="p-3 fs-4">
                                  Total Skipped Answer
                                </th>
                                <td className="p-3 fs-4">
                                  {result?.data?.skipped}
                                </td>
                              </tr>

                              <tr>
                                <th className="p-3 fs-4">
                                  Percentage obtained
                                </th>
                                <td className="p-3 fs-4">
                                  {result?.data?.obtained_marks}
                                </td>
                              </tr>

                              <tr>
                                <th className="p-3 fs-4">Final Result</th>
                                <td className="p-3 fs-4">{result?.result}</td>
                              </tr>
                            </tbody>
                          </table>

                          {result?.result === "fail" ? (
                            <button
                              onClick={() => {
                                startTheExam();
                                setResult(null);
                              }}
                              type="button"
                              className="btn btn-primary py-2 fs-4 my-2"
                            >
                              Re-Attempt
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <button
                                onClick={() => logotu()}
                                type="button"
                                className="btn btn-primary py-2 fs-4 my-2"
                              >
                                Login To Dashbord
                              </button>
                              <button
                                onClick={() => downloadPdf()}
                                type="button"
                                className="btn btn-primary py-2 fs-4 my-2"
                              >
                                Get Certificate
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {startExam === false && result === null ? (
                    <button
                      onClick={() => startTheExam()}
                      type="button"
                      className="btn btn-primary py-3 fs-3 m-0"
                    >
                      Start Exam
                    </button>
                  ) : (
                    startExam === true &&
                    result === null && (
                      <div className="exam-paper">
                        <div className="row justify-content-between">
                          <div className="col-lg-7 col-12 exam-paper-left">
                            <TabContent activeTab={activeTab}>
                              {questions &&
                                questions.length > 0 &&
                                questions.map((item, quesIndex) => (
                                  <TabPane tabId={quesIndex} key={item.id}>
                                    <p className="fs-2">
                                      Question {quesIndex + 1} of{" "}
                                      {questions.length}
                                    </p>
                                    <hr />
                                    <div className="exam-question-container mt-2">
                                      <div className="exam-question">
                                        <h5 className="qestionNO fw-bold">
                                          {item.question}
                                        </h5>
                                      </div>

                                      <div className="exam-question-option mt-3 pb-5 text-center position-relative">
                                        <div
                                          className={`form-check p-2 mb-3 option ${
                                            selectedOption === 1
                                              ? "selected"
                                              : ""
                                          }`}
                                          style={{
                                            border: "1px solid black",
                                            borderRadius: "20px",
                                          }}
                                          onClick={() => handleOptionClick(1)}
                                          onChange={(e) =>
                                            handleChangeCorrentOption(
                                              e.target.value
                                            )
                                          }
                                        >
                                          <input
                                            className="form-check-input "
                                            value="option1"
                                            name={"correctOption" + quesIndex}
                                            type="radio"
                                            id={"chb22" + quesIndex}
                                          />
                                          <label
                                            className="form-check-label fs-6"
                                            htmlFor={"chb22" + quesIndex}
                                          >
                                            {item.option1}
                                          </label>
                                        </div>
                                        <div
                                          className={`form-check p-2 mb-3 option ${
                                            selectedOption === 2
                                              ? "selected"
                                              : ""
                                          }`}
                                          style={{
                                            border: "1px solid black",
                                            borderRadius: "20px",
                                          }}
                                          onClick={() => handleOptionClick(2)}
                                          onChange={(e) =>
                                            handleChangeCorrentOption(
                                              e.target.value
                                            )
                                          }
                                        >
                                          <input
                                            className="form-check-input"
                                            value="option2"
                                            name={"correctOption" + quesIndex}
                                            type="radio"
                                            id={"chb23" + quesIndex}
                                          />
                                          <label
                                            className="form-check-label fs-6"
                                            htmlFor={"chb23" + quesIndex}
                                          >
                                            {item.option2}
                                          </label>
                                        </div>
                                        <div
                                          className={`form-check p-2 mb-3 option ${
                                            selectedOption === 3
                                              ? "selected"
                                              : ""
                                          }`}
                                          style={{
                                            border: "1px solid black",
                                            borderRadius: "20px",
                                          }}
                                          onClick={() => handleOptionClick(3)}
                                          onChange={(e) =>
                                            handleChangeCorrentOption(
                                              e.target.value
                                            )
                                          }
                                        >
                                          <input
                                            className="form-check-input"
                                            value="option3"
                                            name={"correctOption" + quesIndex}
                                            type="radio"
                                            id={"chb24" + quesIndex}
                                            style={{
                                              border: "1px solid black",
                                            }}
                                          />
                                          <label
                                            className="form-check-label fs-6 "
                                            htmlFor={"chb24" + quesIndex}
                                          >
                                            {item.option3}
                                          </label>
                                        </div>
                                        <div
                                          className={`form-check p-2 mb-3 option ${
                                            selectedOption === 4
                                              ? "selected"
                                              : ""
                                          }`}
                                          style={{
                                            border: "1px solid black",
                                            borderRadius: "20px",
                                          }}
                                          onClick={() => handleOptionClick(4)}
                                          onChange={(e) =>
                                            handleChangeCorrentOption(
                                              e.target.value
                                            )
                                          }
                                        >
                                          <input
                                            className="form-check-input "
                                            value="option4"
                                            name={"correctOption" + quesIndex}
                                            type="radio"
                                            id={"chb25" + quesIndex}
                                          />
                                          <label
                                            className="form-check-label fs-6"
                                            htmlFor={"chb25" + quesIndex}
                                          >
                                            {item.option4}
                                          </label>
                                        </div>

                                        {errorMessage != "" && (
                                          <p className="f-error">
                                            {errorMessage}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="row mx-0 px-0">
                                      {activeTab > 0 && (
                                        <div className="col-sm-3 col-12">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setActiveTab(activeTab - 1)
                                            }
                                            className="btn btn-outline-primary w-100 fs-6 py-2 mt-lg-0 mt-2"
                                          >
                                            <i className="fas fa-angle-left me-1  align-middle" />
                                            Previous
                                          </button>
                                        </div>
                                      )}
                                      <div className="col-sm-3 col-12">
                                        <button
                                          onClick={() =>
                                            submitQuesion(item.id, 1, quesIndex)
                                          }
                                          type="button"
                                          className="btn btn-warning w-100 fs-6 py-2 mt-lg-0 mt-3"
                                          style={{
                                            border: "2.5px solid #ffc107",
                                          }}
                                        >
                                          skip
                                        </button>
                                      </div>
                                      <div className="col-sm-3 col-12">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            submitQuesion(item.id, 2, quesIndex)
                                          }
                                          disabled={
                                            answerStatus.toggleButton[
                                              quesIndex
                                            ] == "disabled"
                                          }
                                          className="btn btn-success w-100 fs-6 py-2 mt-lg-0 mt-3"
                                          style={{
                                            border: "2px solid #198754",
                                          }}
                                        >
                                          Submit Answer
                                        </button>
                                      </div>
                                      {activeTab + 1 < questions.length && (
                                        <div className="col-sm-3 col-12">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setActiveTab(activeTab + 1)
                                            }
                                            className="btn btn-outline-primary w-100 fs-6 py-2 mt-lg-0 mt-3"
                                          >
                                            Next
                                            <i className="fas fa-angle-right ms-2 align-middle" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </TabPane>
                                ))}
                            </TabContent>
                          </div>
                          <div className="col-lg-4 exam-paper-right mt-lg-0 mt-5 text-lg-start text-center">
                            <h2 className="exam-paper-right-heading fw-bold mb-3">
                              Question Palette :
                            </h2>
                            <div className="number-index mb-1">
                              <nav>
                                <div className="nav nav-tabs border-0 justify-content-lg-start justify-content-center">
                                  {answerStatus.toggleButton &&
                                    answerStatus.toggleButton.length > 0 &&
                                    answerStatus.toggleButton.map(
                                      (item, index) => (
                                        <button
                                          onClick={() => setActiveTab(index)}
                                          className={
                                            item === "disabled"
                                              ? "bg-success nav-link mb-3 mx-1 active rounded-bottom text-dark"
                                              : item !== "skipped"
                                              ? "nav-link  active mx-1  mb-3 rounded-bottom text-dark"
                                              : "nav-link bg-warning mx-1  mb-3 rounded-bottom text-dark"
                                          }
                                          style={{
                                            width: "4rem",
                                            background: "#358E93",
                                          }}
                                          disabled={item !== "skipped"}
                                          type="button"
                                        >
                                          {index + 1}
                                        </button>
                                      )
                                    )}
                                </div>
                              </nav>
                            </div>
                            <div className="q-badge text-start">
                              <div className="row  align-items-center justify-content-between">
                                <div className="col-lg-6 col-6 col-sm-4">
                                  <p className="fs-6 mb-2">
                                    <span className="badge bg-success fs-6 p-2 me-3">
                                      {answerStatus.answered}
                                    </span>
                                    Answered
                                  </p>
                                </div>
                                <div className="col-lg-6 col-6 col-sm-4">
                                  <p className="fs-6 mb-2">
                                    <span className="badge bg-primary-light fs-6 p-2 me-3">
                                      {answerStatus.notansered}
                                    </span>
                                    Not Answered
                                  </p>
                                </div>
                                <div className="col-lg-6 col-6 col-sm-4">
                                  <p className="fs-6 mb-2">
                                    <span className="badge bg-warning p-2 fs-6 p-2 me-3 text-dark">
                                      {" "}
                                      {answerStatus.skipped}
                                    </span>
                                    Skipped
                                  </p>
                                </div>

                                <div className="col-12"></div>

                                <div
                                  className="col-lg-12 col-md-4 col-7 mx-auto
                                   mt-3"
                                >
                                  <a
                                    href="jaavascript:void(0)"
                                    onClick={() => {
                                      handleEndExam().then((response) => {
                                        getExamResult();
                                        setStartExam(false);
                                      });
                                    }}
                                    className="fs-5 btn btn-primary py-2 w-100 d-block"
                                  >
                                    End Exam
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/*----- container End -----*/}
    </section>
  );
};

export default PosExam;
