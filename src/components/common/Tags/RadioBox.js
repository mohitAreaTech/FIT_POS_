import React from "react";

const RadioBox = ({ label, name, register, option1, option2, value1, value2 }) => {
  return (
    <div className="form-group position-relative mb-4">
      <p className="mb-0">{label}</p>

      <div className="d-flex flex-wrap align-items-start">
        <input
          className="form-control d-none"
          {...register}
          value={value1}
          type="radio"
          id={value1 + "id1"}
          name={name}
        />

        <label className="shadow" htmlFor={value1 + "id1"}>
          <span>{option1}</span> <i className="fas fa-check-circle text-success" />
        </label>

        <input
          className="form-control d-none"
          {...register}
          value={value2}
          type="radio"
          id={value2 + "id2"}
          name={name}
        />

        <label className="shadow" htmlFor={value2 + "id2"}>
          <span> {option2} </span> <i className="fas fa-check-circle text-success" />
        </label>
      </div>
    </div>
  );
};

export default RadioBox;
