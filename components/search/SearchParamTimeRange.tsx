import * as React from "react";
import { SearchParamComponent } from "./SearchParam";
import { Form, TimePicker } from "antd";

export const SearchParamTimeRange: SearchParamComponent = ({ name, label, disabled, config }) => {
  const { format: timeFormat = "HH:mm" } = config ?? {};
  return (
    <Form.Item name={name} {...(label ? { label, style: { marginBottom: 0, marginRight: 10 } } : { noStyle: true })}>
      {/*<TimePicker.RangePicker />*/}
      <TimePicker.RangePicker style={{ width: 220 }} showNow allowClear disabled={disabled} format={timeFormat} />
    </Form.Item>
  );
};
