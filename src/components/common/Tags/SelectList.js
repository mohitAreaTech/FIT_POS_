import React from "react";

const SelectList = ({ label, option, register, id, className, name }) => {
  return (
    <div className={"form-floating position-relative " + className}>
      <select name={name} className="form-select" id={id} {...register}>
        <option value="">Select</option>
        {option.map((item, index) => (
          <option key={index} selected={item.value === "INDIVIDUAL" && "selected"} value={item.value}>
            {item.option}
          </option>
        ))}
      </select>

      {/*----- Input Label -----*/}
      <label htmlFor={id} className="d-block w-100">
        {label}
      </label>
    </div>
  );
};

export default SelectList;
