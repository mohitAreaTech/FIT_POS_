import React from "react";
import SideBar from "../../common/SideBar";
import Header from "../../common/Header";
import { Col, Row } from "reactstrap";
import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import Calender from "./Calendar";
import { GetData } from "../../../api/apiHelper";
import { useEffect } from "react";
import { magmaPDFDownload } from "../../utility/TPApiCall";
import { FaDownload, FaEye, FaRegEdit } from 'react-icons/fa'

const TotalPolicy = () => {
  const topTableHeaderData = ["Type", "Motor", "Health", "Grand Total"];

  const lowerTableHeaderData = [
    "Lead ID",
    "Case Type",
    "Policy Type",
    "Policy Number",
    "Vehicle Type",
    "Vehicle No",
    "Make",
    "Model",
    "Variant",
    'Customer Name',
    'Action'
  ];

  // const downloadFile = fileUrl => {
  //   if (fileUrl) {
  //     // Create an anchor element
  //     const link = document.createElement('a')
  //     link.href = fileUrl
  //     link.setAttribute('download', 'Document') // Set desired file name here
  //     document.body.appendChild(link)
  //     // Trigger click event on the anchor element
  //     link.click()
  //     // Clean up
  //     document.body.removeChild(link)
  //     window.open(fileUrl, '_blank')
  //   } else {
  //     console.error('File URL is empty')
  //   }
  // }

  const downloadFile = (fileUrl, fileName) => {
    if (fileUrl) {
      // Create an anchor element
      const link = document.createElement('a');
      link.href = fileUrl;
  
      // Check if the file is an image
      if (/\.(png|jpg|jpeg|gif)$/i.test(fileUrl)) {
        // If it's an image, convert it to a data URI and set it as the href
        fetch(fileUrl)
          .then(response => response.blob())
          .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            link.href = objectURL;
            link.setAttribute('download', fileName || 'image'); // Set desired file name here
            // Trigger click event on the anchor element
            link.click();
            // Clean up
            URL.revokeObjectURL(objectURL);
          })
          .catch(error => console.error('Error downloading image:', error));
      } else {
        // For non-image files, just set the download attribute
        link.setAttribute('download', fileName || 'file'); // Set desired file name here
        document.body.appendChild(link);
        // Trigger click event on the anchor element
        link.click();
        // Clean up
        document.body.removeChild(link);
      }
    } else {
      console.error('File URL is empty');
    }
  };
  

  const optionsFinancialYear = [
    { label: "2024-2025", value: "2024-2025" },
    { label: "2023-2024", value: "2023-2024" },
    { label: "2022-2023", value: "2022-2023", disabled: false },
    { label: "2021-2022", value: "2021-2022" },
    { label: "2020-2021", value: "2020-2021" },
    { label: "2019-2020", value: "2019-2020" },
    { label: "2018-2019", value: "2018-2019" },
    { label: "2017-2018", value: "2017-2018" },
  ];

  const optionsSourceData = [
    { label: "Online", value: "Online" },
    { label: "Offline", value: "offline_SubmitPolicy" },
    // { label: "Excel", value: "Excel", disabled: false },
  ];

  const optionsProductData = [
    { label: "Motor", value: "Motor" },
    { label: "Health", value: "Health" },
  ];

  const optionsProductTypeData = [
    { label: "Private Car", value: "Pvt Car" },
    { label: "Two Wheeler", value: "MotorBike" },
    { label: "GCV", value: "GCV" },
    { label: "PCV", value: "PCV" },
    { label: "MISC-D", value: "MISC-D" },
  ];

  const optionsPolicyData = [
    { label: "CP", value: "Comprehensive" },
    { label: "TP", value: "ThirdParty" },
    { label: "SAOD", value: "ODOnly" },
  ];

  const optionsInsurerData = [
    {
      label: "Go Digit Life Insurance Limited",
      value: "Go Digit Life Insurance Limited",
    },
    {
      label: "Acko General Insurance Co. Ltd.",
      value: "Acko General Insurance Co. Ltd.",
    },
    {
      label: "Aditya Birla Health Insurance Co. Ltd.",
      value: "Aditya Birla Health Insurance Co. Ltd.",
      disabled: false,
    },
    {
      label: "Aditya Birla Sun Life Insurance Co. Ltd.",
      value: "Aditya Birla Sun Life Insurance Co. Ltd.",
    },
    {
      label: "Aegon Life Insurance Co. Ltd.",
      value: "Aegon Life Insurance Co. Ltd.",
    },
    {
      label: "Aviva Life Insurance Co.India Ltd.",
      value: "Aviva Life Insurance Co.India Ltd.",
    },
    {
      label: "Bajaj Allianz General Insurance Co. Ltd.",
      value: "Bajaj Allianz General Insurance Co. Ltd.",
    },
    {
      label: "Bajaj Allianz Life Insurance Co. Ltd.",
      value: "Bajaj Allianz Life Insurance Co. Ltd.",
    },
  ];

  const [selectedFinancialYearData, setselectedFinancialYearData] = useState(
    []
  );

  const [selectedSourceData, setSelectedSourceData] = useState([]);

  const [selectedProductData, setSelectedProductData] = useState([]);

  const [selectedProductTypeData, setSelectedProductTypeData] = useState([]);

  const [selectedPolicyData, setSelectedPolicyData] = useState([]);

  const [selectedInsurerData, setSelectedInsurerData] = useState([]);

  const [allPolicies, setAllPolicies] = useState();

  const [filteredData, setFilteredData] = useState();

  const [nameSearchData, setNameSearchData] = useState();

  const [selectedDateRange, setSelectedDateRange] = useState([]);

  function downloadBase64File1(contentBase64, fileName) {
    const linkSource = `data:application/pdf;base64,${contentBase64}`;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    // setData(arr);
    GetData("admin/pendingPool").then((response) => {
      if (
        response?.success === true &&
        response?.message === "All Pending Leads Fetched!!"
      ) {
        // console.log('RESPONSE', response.data)
        // const responseData = response?.data
        // const transformedData = transformData(responseData)
        // console.log('transformedData', transformedData)
        setData(response?.data);
        setAllPolicies(response?.data);
        setFilteredData(response?.data.reverse());
      }
    });
  }, []);

  useEffect(() => {
    console.log("selectedFinancialYearData", selectedFinancialYearData);
  }, [selectedFinancialYearData]);

  const allFilter = () => {
    if (
      selectedFinancialYearData.length === 0 &&
      selectedDateRange.length === 0 &&
      selectedSourceData.length === 0 &&
      selectedProductData.length === 0 &&
      selectedProductTypeData.length === 0 &&
      selectedPolicyData.length === 0 &&
      nameSearchData === ""
    ) {
      setFilteredData(data);
    } else {
      let filteredResult = [...data];
      if (selectedFinancialYearData.length > 0) {
        filteredResult = filteredResult.filter((item) => {
          const [startYear, endYear] =
            selectedFinancialYearData[0].value.split("-");
          const startMonth = 3;
          const endMonth = 2;
          const itemDate = new Date(item?.createdAt);
          const itemYear = itemDate.getFullYear();
          const itemMonth = itemDate.getMonth();
          if (
            (itemYear === parseInt(startYear) && itemMonth >= startMonth) ||
            (itemYear === parseInt(endYear) && itemMonth <= endMonth) ||
            (itemYear > parseInt(startYear) && itemYear < parseInt(endYear))
          ) {
            return true;
          }
          return false;
        });
      }

      if (selectedDateRange.length > 0) {
        filteredResult = filteredResult.filter((item) => {
          const [startDate, endDate] = selectedDateRange;
          const itemDate = new Date(item?.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }

      if (selectedSourceData.length > 0) {
        filteredResult = filteredResult.filter((item) => {
          return selectedSourceData.some((source) =>
            item?.lead_type.includes(source.value)
          );
        });
      }

      if (selectedProductTypeData.length > 0) {
        filteredResult = filteredResult.filter((item) => {
          return selectedProductTypeData.some((productType) =>
            item?.lead_data?.vehicleCategory.includes(productType.value)
          );
        });
      }

      if (selectedPolicyData.length > 0) {
        filteredResult = filteredResult.filter((item) => {
          return selectedPolicyData.some((policyData) =>
            item?.lead_data?.policyType.includes(policyData.value)
          );
        });
      }

      if (nameSearchData) {
        filteredResult = filteredResult.filter((item) => {
          return item?.lead_data?.customerFullName
            .toLowerCase()
            .includes(nameSearchData.toLowerCase());
        });
      }
      console.log("FILTERED RESULT", filteredResult);
      setFilteredData(filteredResult);
    }
  };

  const resetFilters = () => {
    setselectedFinancialYearData([]);
    setSelectedDateRange([]);
    setSelectedSourceData([]);
    setSelectedProductData([]);
    setSelectedProductTypeData([]);
    setSelectedPolicyData([]);
    setNameSearchData("");
    setFilteredData(data);
  };

  const handleDateRange = (dates) => {
    setSelectedDateRange(dates);
  };

  // const transformData = data => {
  //   return data?.map(item => {
  //     const leadData = JSON.parse(item?.lead_data)
  //     return {
  //       id: item?.id,
  //       lead_id: item?.lead_id,
  //       lead_assignedTo: item?.lead_assignedTo,
  //       lead_generatedBy: item?.lead_generatedBy,
  //       lead_generated_for: item?.lead_generated_for,
  //       lead_pending_at: item?.lead_pending_at,
  //       lead_status: item?.lead_status,
  //       lead_type: item?.lead_type,
  //       updatedAt: item?.updatedAt,
  //       createdAt: item?.createdAt,
  //       lead_data: leadData
  //     }
  //   })
  // }

  // if (data === undefined) return "";


  return (
    <div className="">
      <SideBar />

      <section class="">
        <div class="">
          {/* <div id="main_div"> */}
          <Header />
          {/* </div> */}

          {/* <Header /> */}
          {/*----- Content Body Section Start -----*/}
          <section
            className="total-policy"
            // className={`${
            //   apiRequestQQ?.openSideBar ? 'content-body' : 'd-none'
            // }`}
          >
            <div className="border border-info rounded-4  p-2 container-fluid">
              <div
                style={{
                  backgroundColor: "#2690d0",
                  color: "white",
                  paddingLeft: "4px",
                }}
                className="p-1 rounded-top fw-bold"
              >
                Policies
              </div>

              {/* ---- Input Fields Section Start ---- */}

              {/* <form> */}
              <div className="border mb-2 p-1">
                <div className="cont">
                  {/* ---- First Row Start ---- */}

                  <Row>
                    {/* ---- Financial Year Field Col ---- */}

                    <div className="input-inf">
                      {/* <div className='select-fin'> */}
                      <label style={{ fontSize: "15px" }}>
                        Select Financial Year
                      </label>

                      <MultiSelect
                        className="mul"
                        options={optionsFinancialYear}
                        value={selectedFinancialYearData}
                        onChange={setselectedFinancialYearData}
                        labelledBy="Select Financial Year"
                      />
                    </div>

                    {/* ---- Date Field Col ---- */}

                    <div className="input-inf">
                      <label style={{ fontSize: "15px" }}>
                        Select Date OR Date-Range
                      </label>
                      <div
                        className=".rmsc .dropdown-heading"
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          borderRadius: "4px",
                        }}
                      >
                        <Calender handleDateRange={handleDateRange} />
                      </div>
                    </div>

                    {/* ---- Source Field Col ---- */}

                    <Col>
                      <div>
                        <label style={{ fontSize: "15px" }}>
                          Select Source
                        </label>
                        <MultiSelect
                          options={optionsSourceData}
                          value={selectedSourceData}
                          onChange={setSelectedSourceData}
                          labelledBy="Select Source"
                        />
                      </div>
                    </Col>

                    {/* ---- Product Field Col ---- */}

                    <Col>
                      <div>
                        <label style={{ fontSize: "15px" }}>
                          Select Product
                        </label>
                        <MultiSelect
                          options={optionsProductData}
                          value={selectedProductData}
                          onChange={setSelectedProductData}
                          labelledBy="Select Product"
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* ---- Second Row Start ---- */}

                  <Row>
                    {/* ---- Product Type Field Col ---- */}

                    <Col className="my-2">
                      <div>
                        <label style={{ fontSize: "15px" }}>Product Type</label>
                        <MultiSelect
                          options={optionsProductTypeData}
                          value={selectedProductTypeData}
                          onChange={setSelectedProductTypeData}
                          labelledBy="Select Product Type"
                        />
                      </div>
                    </Col>

                    {/* ---- Policy Type Field Col ---- */}

                    <Col className="my-2">
                      <div>
                        <label style={{ fontSize: "15px" }}>Policy Type</label>
                        <MultiSelect
                          options={optionsPolicyData}
                          value={selectedPolicyData}
                          onChange={setSelectedPolicyData}
                          labelledBy="Select Policy Type"
                        />
                      </div>
                    </Col>

                    {/* ---- Insurer Type Field Col ---- */}

                    <Col className="my-2">
                      <div>
                        <label style={{ fontSize: "15px" }}>
                          Select Insurer
                        </label>
                        <MultiSelect
                          options={optionsInsurerData}
                          value={selectedInsurerData}
                          onChange={setSelectedInsurerData}
                          labelledBy="Select Insurer"
                        />
                      </div>
                    </Col>

                    {/* ---- Search Input Col ---- */}

                    <Col className="my-2">
                      <div>
                        <input
                          className="search_inp"
                          placeholder="Search Customer Name ...."
                          type="text"
                          onChange={(e) => setNameSearchData(e.target.value)}
                        ></input>
                      </div>
                    </Col>
                  </Row>

                  {/* ---- Third Row Start ---- */}

                  <Row>
                    {/* ---- Buttons Col ---- */}

                    <div className="poly-btn ">
                      <button
                        className="rounded poly_btn_1"
                        style={{ backgroundColor: "#00afca" }}
                        onClick={() => allFilter()}
                      >
                        Search
                      </button>
                      <button
                        onClick={() => resetFilters()}
                        className="bg-danger rounded poly_btn_1"
                      >
                        Reset
                      </button>
                    </div>
                  </Row>
                </div>
              </div>
              {/* </form> */}

              {/* ---- TopTableStart ---- */}

              <table className="table text-capitalize pt-2 table-bordered display nowrap">
                <thead>
                  <tr>
                    {topTableHeaderData.map((x, i) => (
                      <th
                        key={i}
                        style={{
                          backgroundColor: "#2690d0",
                          color: "white",
                          fontWeight: "400",
                          fontSize: "14px",
                          width: i === 0 ? "50px" : "129px",
                        }}
                      >
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Total Policy</td>
                    <td>{data.length}</td>
                    <td>0</td>
                    <td>{data.length}</td>
                  </tr>
                </tbody>
              </table>

              <hr />

              {/* ---- Top Pagination ---- */}

              <div
                id="top_pagination"
                className="d-flex m-2 justify-content-between"
              >
                <div className="text-primary">
                  Showing {filteredData ? filteredData.length : 0} of{" "}
                  {filteredData ? filteredData.length : 0} entries
                </div>
                <div className="d-flex">
                  <div className="mx-2">First</div>
                  <div className="mx-2">Previous</div>
                  <div
                    style={{ backgroundColor: "#2690d0" }}
                    className="mx-2 p-1 rounded"
                  >
                    1
                  </div>
                  <div className="mx-2">Next</div>
                  <div className="mx-2">Last</div>
                </div>
              </div>

              {/* ---- LowerTableStart ---- */}

              <div className="table-responsive"><table className="table text-capitalize pt-2 table-bordered display nowrap ">
                <thead>
                  <tr>
                    {lowerTableHeaderData.map((x, i) => (
                      <th
                        key={i}
                        style={{
                          backgroundColor: "#2690d0",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "400",
                          width: "auto",
                        }}
                      >
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody style={{ fontSize: "14px" }}>
                  {filteredData &&
                    filteredData.map((info, index) => (
                      <tr key={index}>
                        <td>{info?.lead_id}</td>
                        <td>{info?.lead_data?.caseType}</td>
                        <td>
                          <div>{info?.lead_data?.policyType}</div>
                        </td>
                        <td>
                          <div>{info?.lead_data?.policy_number}</div>
                        </td>
                        <td>{info?.lead_data?.vehicleCategory}</td>
                        <td>{info?.lead_data?.vehicleNumber}</td>
                        <td>{info?.lead_data?.vehicleMake}</td>
                        <td>{info?.lead_data?.vehicleModel}</td>
                        <td>{info?.lead_data?.vehicleVariant}</td>
                        <td>{info?.lead_data?.customerFullName}</td>
                        <td>
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                downloadFile(
                                  info?.lead_data?.currentIssuedPolicyDocument, 'Current_Issued_Policy_Document'
                                )
                              }
                            >
                              <FaDownload style={{ color: '#2690d0' }} />
                            </span>
                          </td>
                      </tr>
                    ))}
                </tbody>
              </table></div>

              {/* ---- Lower Pagination ---- */}

              {/* <div
                id='bottom_pagination'
                className='d-flex m-3 justify-content-between'
              >
                <div className='text-primary'>Showing 1 to 1 of 1 entries</div>
                <div className='d-flex'>
                  <div className='mx-2'>First</div>
                  <div className='mx-2'>Previous</div>
                  <div className='mx-2 bg-info p-1 rounded'>1</div>
                  <div className='mx-2'>Next</div>
                  <div className='mx-2'>Last</div>
                </div>
              </div> */}
            </div>
            {/*----- row End -----*/}
          </section>
        </div>
      </section>
    </div>
  );
};

export default TotalPolicy;
