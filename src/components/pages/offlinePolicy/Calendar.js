import { useEffect, useState } from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import moment from "moment";

const Calender = ({ handleDateRange }) => {
  const [dates, setDates] = useState([]);

  console.log(dates);

  useEffect(() => {
    console.log("handleDate", dates);
    handleDateRange(dates);
  }, [dates]);

  const handleDate = (val) => {
    console.log("handleDate", val);
    if (!val) {
      setDates([]);
    } else setDates(val.map((item) => (item ? item?.$d : "")));
  };

  return (
    <>
      <RangePicker
        className="date-pic"
        style={{ border: "none", outline: "none", paddingTop: "0px" }}
        onChange={(val) => handleDate(val)}
        // onChange={(val) => {
        //   setDates(
        //     val.map((item) => {
        //       return moment(item).format("DD-MM-YYYY");
        //     })
        //   );
        // }}
      />
    </>
  );
};

export default Calender;
