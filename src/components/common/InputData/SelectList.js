import React from "react";
import { Helmet } from "react-helmet";

const SelectList = ({ label, showclass, option, register, id, error }) => {
  return (
    <>
      {/* <Helmet>
        <script>
          {`
             $(function () {
              $("#${id}").select2();
          });
  
          `}
        </script> ${showclass}
      </Helmet> */}
      <div className={`col-xl-3 col-lg-4 col-md-6 col-12 `}>
        <div className="position-relative mb-3">
          {/*----- Input Label -----*/}
          <div class="form-floating">
            <select className="form-select" style={{ paddingLeft:'12px'}} id={id} {...register}>
              <option className="d-none" value="">
                Select {label}
              </option>
              {option.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.option}
                </option>
              ))}
            </select>

            {/* <label htmlFor={id}>
            
              {label}
              {label == "Case type" && <span class="text-danger">*</span>}
              {label == "Policy type" && <span class="text-danger">*</span>}
            </label> */}

            {error && <p className="mb-0 f-error">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectList;
