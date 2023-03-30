import { Form, Input } from "antd";
import * as React from "react";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamInput: SearchParamComponent = ({ name, placeholder, options, label, width, disabled }) => {
  return (
    <Form.Item name={name} {...(label ? { label, style: { marginBottom: 0, marginRight: 10 } } : { noStyle: true })}>
      <Input placeholder={placeholder?.toString()} style={{ minWidth: 100, width }} disabled={disabled} allowClear />
    </Form.Item>
  );
};
