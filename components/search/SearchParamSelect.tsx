import { Form, Select } from "antd";
import * as React from "react";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamSelect: SearchParamComponent = ({ name, title, options, label }) => {
  return (
    <Form.Item name={name} initialValue={options?.[0].value} label={label}>
      <Select placeholder={title} allowClear style={{ minWidth: 100 }}>
        {options?.map((option, sidx) => (
          <Select.Option key={sidx} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
