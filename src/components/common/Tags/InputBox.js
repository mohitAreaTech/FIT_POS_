import React from "react";

const InputBox = ({ label, type, error, name, register, id, placeholder, defaultValue, value }) => {
  return (
    <div className="form-floating position-relative">
      <input
        {...register}
        name={name}
        type={type}
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="form-control w-100"
        value={value}
      />

      <label className="w-100" htmlFor={id}>
        {label}
      </label>

      {error && <p className="m-0 f-error">{error}</p>}
    </div>
  );
};

export default InputBox;




