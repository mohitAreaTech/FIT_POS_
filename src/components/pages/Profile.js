import React from "react";
import SideBar from "../common/SideBar";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useSelector } from "react-redux";

function Profile() {
  const data = useSelector((state) => state?.root?.userDetails);
  console.log(data);
  return (
    <div>
      <SideBar />

      <section class="home-section">
        <div class="home-content">
          <div id="main_div">
            <Header />

            <section class="profile-document">
              <div class="row">
                <div class="col-lg-4">
                  <div class="profile-detail-div">
                    <div class="profile-picture">
                      <img src={data?.profile_picture} alt="img" />
                    </div>
                    <h3>{data.name}</h3>
                    <p>
                      <a href="tel:9876543210">{data.phone}</a>
                    </p>
                    <p>
                      <a href="mailto:abctest@gmail.com">{data.email}</a>
                    </p>
                    <ul>
                      <li class="e-info">
                        <div class="li-img">
                          <img src="assets/img/OBJECTS.png" alt="img" />
                        </div>
                        <strong>
                          Education <span>10 Pass</span>
                        </strong>
                      </li>
                      <li class="l-info">
                        <div class="li-img">
                          <img src="assets/img/OBJECTS-1.png" alt="img" />
                        </div>
                        <strong>
                          Location{" "}
                          <span>{data?.address}{data?.address_2 && data?.address_2}</span>
                        </strong>
                      </li>
                      <li class="skill-info">
                        <div class="li-img">
                          <img src="assets/img/OBJECTS-2.png" alt="img" />
                        </div>
                        <strong>
                          Skills & Certificate <span>Non-Life</span>
                        </strong>
                      </li>
                      <li class="downlode-btn">
                        <button>
                          <i class="bx bx-download"></i> Download
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-lg-8">
                  <div class="form-div">
                    <h2>Upload Documents</h2>
                    <form>
                      <div class="form-box">
                        <label for="formFile" class="form-label">
                          Pan Card
                        </label>
                        <input
                          maxLength={10}
                          type="text"
                          style={{ marginRight: "25px" }}
                          defaultValue={data?.pan_number}
                          class="form-control text-uppercase"
                          placeholder="Pancard No"
                        />
                        <div class="file-input-box">
                          <input
                            type="file"
                            id="file"
                            aria-label="File browser example"
                          />
                          <button class="view_icon" title="View">
                            <img src="assets/img/view.png" alt="" />
                          </button>
                          <button class="edit_icon" title="Edit">
                            <img src="assets/img/edit.png" alt="" />
                          </button>
                        </div>
                      </div>
                      <div class="form-box">
                        <label for="formFile" class="form-label">
                          Aadhar Card
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          defaultValue={data?.adhar_number}
                          class="form-control"
                          placeholder="Aadhar Card"
                        />
                        <br />
                        <br />
                        <div class="file-input-box">
                          <input
                            type="file"
                            id="file"
                            aria-label="File browser example"
                          />
                          <button class="view_icon" title="View">
                            <img src="assets/img/view.png" alt="" />
                          </button>
                          <button class="edit_icon" title="Edit">
                            <img src="assets/img/edit.png" alt="" />
                          </button>
                        </div>
                        <div class="file-input-box">
                          <input
                            type="file"
                            id="file"
                            aria-label="File browser example"
                          />
                          <button class="view_icon" title="View">
                            <img src="assets/img/view.png" alt="" />
                          </button>
                          <button class="edit_icon" title="Edit">
                            <img src="assets/img/edit.png" alt="" />
                          </button>
                        </div>
                      </div>
                      <div class="form-box">
                        <div class="file-input-box">
                          <label for="formFile" class="form-label black-label">
                            10th /12th Graduation
                          </label>
                          <input
                            type="file"
                            id="file"
                            aria-label="File browser example"
                          />
                          <button class="view_icon" title="View">
                            <img src="assets/img/view.png" alt="" />
                          </button>
                          <button class="edit_icon" title="Edit">
                            <img src="assets/img/edit.png" alt="" />
                          </button>
                        </div>
                        <div class="file-input-box">
                          <label for="formFile" class="form-label black-label">
                            Profile
                          </label>
                          <input
                            type="file"
                            id="file"
                            aria-label="File browser example"
                          />
                          <button class="view_icon" title="View">
                            <img src="assets/img/view.png" alt="" />
                          </button>
                          <button class="edit_icon" title="Edit">
                            <img src="assets/img/edit.png" alt="" />
                          </button>
                        </div>
                        <div class="file-input-box">
                          <label for="formFile" class="form-label black-label">
                            Signature
                          </label>
                          <input
                            type="file"
                            id="file"
                            aria-label="File browser example"
                          />
                          <button class="view_icon" title="View">
                            <img src="assets/img/view.png" alt="" />
                          </button>
                          <button class="edit_icon" title="Edit">
                            <img src="assets/img/edit.png" alt="" />
                          </button>
                        </div>
                      </div>
                      <input type="submit" class="submit-btn" />
                    </form>
                  </div>
                </div>
              </div>
            </section>
            <Footer />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
