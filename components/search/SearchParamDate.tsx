import * as React from "react";
import { SearchParamComponent } from "./SearchParam";
import { DatePicker, Form, DatePickerProps } from "antd";

export const SearchParamDate: SearchParamComponent = ({ name, label, picker, width }) => {
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <Form.Item name={name} {...(label ? { label, style: { marginBottom: 0, marginRight: 10 } } : { noStyle: true })}>
      <DatePicker style={{ width: width ?? 120 }} onChange={onChange} allowClear picker={picker ?? "date"} />
    </Form.Item>
  );
};
