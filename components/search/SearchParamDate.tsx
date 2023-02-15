import * as React from "react";
import { SearchParamComponent } from "./SearchParam";
import { DatePicker, Form, DatePickerProps } from "antd";

export const SearchParamDate: SearchParamComponent = ({ name, label, picker }) => {
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <Form.Item name={name} {...(label ? { label } : { noStyle: true })}>
      <DatePicker style={{ width: 120 }} onChange={onChange} allowClear picker={picker ?? "date"} />
      {/*<DatePicker style={{ width: 120 }} onChange={onChange} allowClear picker={"month"} />*/}
    </Form.Item>
  );
};
