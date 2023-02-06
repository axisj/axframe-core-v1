import { Form, Select } from "antd";
import * as React from "react";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamSelect: SearchParamComponent = ({ name, placeholder, options, label, width, loading }) => {
  return (
    <Form.Item name={name} {...(label ? { label, style: { marginRight: 10 } } : { noStyle: true })}>
      <Select placeholder={placeholder} allowClear style={{ minWidth: 100, width }} loading={loading}>
        {options?.map((option, sidx) => (
          <Select.Option key={sidx} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
