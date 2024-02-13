import React from "react";
import SideBar from "../common/SideBar";
import DashboardHeader from "../common/DashboardHeader";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useSelector } from "react-redux";

function Dashboard() {
  const data = useSelector((state) => state?.root?.userDetails);

  return (
    <div>
      <SideBar />

      <section className="home-section">
        <div className="home-content">
          <div id="main_div">
            <Header />
            <DashboardHeader />
            {/* <!-- pi --> */}
            {/* <section className="business-info-chart">
              <div className="row">
                <div className="col-lg-6">
                  <div className="detail-box">
                    <h2>Monthly Business</h2>
                    <figure className="highcharts-figure">
                      <div id="container"></div>
                    </figure>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="detail-box">
                    <h2>Business Bifurcation</h2>
                    <figure className="highcharts-figure">
                      <div id="container1"></div>
                    </figure>
                  </div>
                </div>
              </div>
            </section> */}
            {/* <!--binfo--> */}
            {/* <section className="more-profile-info">
              <div className="row">
                <div className="col-lg-4">
                  <div className="notifications">
                    <h3>Notifications</h3>
                    <ul>
                      <li>
                        Married Women Property Act ?<a href="#">View More</a>
                      </li>
                      <li>
                        What is NO Claim Bonus? <a href="#">View More</a>
                      </li>
                      <li>
                        What is insured declared value?{" "}
                        <a href="#">View More</a>
                      </li>
                      <li>
                        What is Agreed Value Policy? <a href="#">View More</a>
                      </li>
                    </ul>
                  </div>
                  <div className="conversion-retio">
                    <h4>Conversion Ratio</h4>
                    <ul>
                      <li>
                        <img src="assets/img/Layer_1.png" alt="" />
                        <span>
                          <strong>10</strong> Conversion
                        </span>
                      </li>
                      <li>
                        <img src="assets/img/Layer_1-1.png" alt="" />
                        <span>
                          <strong>05</strong> Quotation
                        </span>
                      </li>
                      <li>
                        <img src="assets/img/Layer_1-2.png" alt="" />
                        <span>
                          <strong>20</strong> Ratio
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="earning-chat">
                    <h4>Earning</h4>
                    <figure className="highcharts-figure">
                      <div id="container2"></div>
                    </figure>
                  </div>
                </div>
              </div>
            </section> */}

            {/* <section className='Details'>
              <div className='row'>
                <div className='col-lg-3'>
                  <div className='details-box'>
                    <img src='assets/img/second.png' alt='img' />
                    <strong>
                      299
                      <span>policies</span>
                    </strong>
                  </div>
                </div>
                <div className='col-lg-3'>
                  <div className='details-box'>
                    <img src='assets/img/seven.png' alt='img' />
                    <strong>
                      00
                      <span>Renewals</span>
                    </strong>
                  </div>
                </div>
                <div className='col-lg-3'>
                  <div className='details-box'>
                    <img src='assets/img/fo.png' alt='img' />
                    <strong>
                      00
                      <span>Claim Assistance</span>
                    </strong>
                  </div>
                </div>
                <div className='col-lg-3'>
                  <div className='details-box'>
                    <img src='assets/img/fif.png' alt='img' />
                    <strong>
                      02
                      <span>Offline Quotes</span>
                    </strong>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-4'>
                  <div className='details-box'>
                    <img src='assets/img/six.png' alt='img' />
                    <strong>
                      00
                      <span>Raise Ticket</span>
                    </strong>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='details-box'>
                    <img src='assets/img/first.png' alt='img' />
                    <strong>
                      00
                      <span>Quotation</span>
                    </strong>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='details-box'>
                    <img src='assets/img/third.png' alt='img' />
                    <strong>
                      02
                      <span>Inspection</span>
                    </strong>
                  </div>
                </div>
              </div>

              
            </section> */}
          </div>
        </div>

        {/* <div className="fixed-bottom" style={{background:'aqua', }}> */}

        <Footer />
        {/* </div> */}
      </section>
    </div>
  );
}

export default Dashboard;
