import React from "react";

const InputField = ({
  label,
  showclass,
  type,
  error,
  name,
  register,
  id,
  placeholder,
  value,
}) => {
  const todayDate = new Date().toISOString().split("T")[0];

  // console.log("class", showclass ${showclass})
  return (
    <div class={`col-xl-3 col-lg-4 col-md-6 col-12 `}>
      <div class="position-relative mb-3">
        <div class="form-floating inother">
          <input
            {...register}
            name={name}
            type={type}
            id={id}
            placeholder={placeholder}
            max={type == "date" && todayDate}
            value={value}
            className="form-control"
          />

          <label htmlFor={id}>
            {label}
            {/* <span class="text-danger">*</span> */}
          </label>
          {error && <p className="mb-0 f-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default InputField;
