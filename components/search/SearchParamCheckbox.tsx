import { Checkbox, Form } from "antd";
import * as React from "react";
import { SearchParamComponent } from "./SearchParam";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useI18n } from "../../hooks";

export const SearchParamCheckbox: SearchParamComponent = ({ name, title, options = [], label }) => {
  const { t } = useI18n();
  const defaultCheckedList = [];

  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(!e.target.checked ? [] : options.map((opt) => opt.value));
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <Form.Item
      name={name}
      // initialValue={options?.[0].value}
      {...(label ? { label, style: { marginRight: 10 } } : { noStyle: true })}
      valuePropName={"checked"}
    >
      {/*<Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>*/}
      {/*  {t.common.checkAll}*/}
      {/*</Checkbox>*/}
      <Checkbox.Group options={options} value={checkedList} onChange={onChange} />
    </Form.Item>
  );
};
