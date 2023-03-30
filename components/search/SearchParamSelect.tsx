import { Form, Select } from "antd";
import * as React from "react";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamSelect: SearchParamComponent = ({
  name,
  placeholder,
  options,
  label,
  width,
  loading,
  disabled,
}) => {
  return (
    <Form.Item name={name} {...(label ? { label, style: { marginBottom: 0, marginRight: 10 } } : { noStyle: true })}>
      <Select
        placeholder={placeholder}
        showSearch
        allowClear
        style={{ minWidth: 100, width }}
        loading={loading}
        options={options}
        disabled={disabled}
      />
    </Form.Item>
  );
};
