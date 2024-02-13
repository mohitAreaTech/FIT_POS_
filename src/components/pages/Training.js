import React, { useEffect } from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { Document, Page, pdfjs } from "react-pdf";
import {
  getTrainingModule,
  handleModuleComplete,
  sendErrorMessage,
  sendSuccessInfo,
} from "../../components/services/posServices";
import { useNavigate } from "react-router-dom";
// import DocViewer from "../../common/Training/DocViewer";
pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Training() {
  const [training, setTraining] = React.useState([]);
  const [callApi, setCallApi] = React.useState(true);
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pdfUrl, setPdfUrl] = React.useState("");
  const navigate = useNavigate();
  // const myPdfUrl = 'http://localhost:3341/assets/modules/module1.pdf'
  const myPdfUrl = "https://api.flaskitsolutions.com/assets/modules/module1.pdf";
  useEffect(() => {
    if (callApi === true) {
      getTrainingModule().then((response) => {
        if (response.status === true) {
          if (response.data.length > 0) {
            console.log("resonse", response.data);
            let module = response.data.find(
              (item) => item.isCompleted === false
            );
            if (module) {
              setPdfUrl(module?.training_module?.content);
              setTraining(module);
            } else {
              // sendSuccessInfo(
              //   'Your Training is completed, Please proceed to exam'
              // )
              navigate("/posExam");
            }
          }
        }
      });
      setCallApi(false);
    }
  }, [callApi]);

  const handleDownloadFile = (file) => {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = file;
    a.click();
  };

  const markCompleteModule = (e, id) => {
    e.preventDefault();
    // if (e?.target?.checked === true) {
    handleModuleComplete(id).then((response) => {
      if (response?.status === true) {
        setCallApi(true);
      } else {
        sendErrorMessage(response);
      }
    });
    // }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  return (
    <>
      <div class="home-content">
        <div id="main_div">
          <Header />
          <section class="trainging_section">
            <div class="row">
              <section className="trainingSection mb-1 pb-3">
                {/*----- Blur set effect -----*/}
                <div className="blur-bg-blocks">
                  <aside className="blur-bg-set">
                    <div className="blur-bg blur-bg-a" />
                    <div className="blur-bg blur-bg-b" />
                    <div className="blur-bg blur-bg-c" />
                  </aside>
                </div>
                {/*----- container start -----*/}
                <div className="container">
                  <div className="row justify-content-between align-items-center">
                    <div className="col-lg-8 col-12 text-center mx-auto my-3 py-3">
                      <h1 className="text-capitalize about-heading mx-auto">
                        FIT PosP Training
                      </h1>
                    </div>
                    <div className="col-12">
                      <div className="accordion" id="TrainingAccordion">
                        {/*----- accordion -----*/}
                        <div className="accordion-item bg-transparent mb-4">
                          <h2
                            className="accordion-header "
                            style={{ background: "#358E93" }}
                          >
                            <button
                              className="accordion-button fs-2 px-5 bg-transparent"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#mod1"
                            >
                              {training?.training_module?.module_title}
                            </button>
                          </h2>
                          {/* <h4 className="m-3">{training?.training_module?.module_description}</h4> */}
                          <div
                            id="mod1"
                            className="accordion-collapse collapse show p-5"
                            data-bs-parent="#TrainingAccordion"
                          >
                            <div className="row">
                              <div className="col-lg-12">
                                {/* <ol className="ps-0">
                        <li className="mb-4">
                          <p
                            className="fs-4"
                            dangerouslySetInnerHTML={{ __html: training?.training_module?.content }}
                          ></p>
                        </li>
                      </ol> */}
                                <Document
                                  file={pdfUrl}
                                  onLoadSuccess={onDocumentLoadSuccess}
                                >
                                  <Page
                                    height={700}
                                    width={800}
                                    pageNumber={pageNumber}
                                  />
                                </Document>
                              </div>

                              {/* <div className="col-lg-12"> */}

                              <div className="col-lg-6 mx-auto">
                                <div className="pagec text-center fs-3 fw-bold border-bottom border-primary border-3 pb-4 mb-">
                                  Page {pageNumber || (numPages ? 1 : "--")} of{" "}
                                  {numPages || "--"}
                                </div>
                              </div>

                              <div className="col-12"></div>

                              <div className="col-lg-2 col-12 me-auto">
                                <button
                                  type="button"
                                  disabled={pageNumber <= 1}
                                  onClick={previousPage}
                                  className="btn btn-primary w-100 d-block py-3 fs-5 mt-5"
                                >
                                  <i className="fa fa-arrow-left mr-2"></i>{" "}
                                  Previous
                                </button>
                              </div>

                              <div className="col-lg-2 col-12 ms-auto">
                                <button
                                  type="button"
                                  disabled={pageNumber >= numPages}
                                  onClick={nextPage}
                                  className="btn btn-primary w-100 d-block py-3 fs-5 mt-5"
                                >
                                  Next{" "}
                                  <i className="fa fa-arrow-right ml-2"></i>
                                </button>
                              </div>
                              {/* </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-9 col-12"></div>
                    <div className="col-lg-2 col-12">
                      <button
                        disabled={pageNumber !== numPages}
                        type="button"
                        onClick={(e) => markCompleteModule(e, training?.id)}
                        className="btn btn-primary w-100 d-block py-3 fs-5 mt-3"
                      >
                        Attempt Exam
                      </button>
                    </div>
                  </div>
                </div>
                {/*----- container End -----*/}
              </section>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Training;
