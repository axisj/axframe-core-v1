import { Checkbox, Form } from "antd";
import * as React from "react";
import { SearchParamComponent } from "./SearchParam";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useI18n } from "hooks";

export const SearchParamCheckbox: SearchParamComponent = ({
  name,
  options = [],
  label,
  checkAllItem,
  onChangedCheckAllItem,
}) => {
  const { t } = useI18n();
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const form = Form.useFormInstance();
  const checkedAll = Form.useWatch(name, form);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const list = e.target.checked ? options.map((opt) => opt.value) : [];
    form.setFieldValue(name, list);
    onChangedCheckAllItem?.();
  };

  React.useEffect(() => {
    if (checkedAll) {
      setIndeterminate(!!checkedAll.length && checkedAll.length < options.length);
      setCheckAll(checkedAll.length === options.length);
    }
  }, [checkedAll, options.length]);

  return (
    <Form.Item {...(label ? { label, style: { marginRight: 10 } } : { noStyle: true })}>
      {checkAllItem && (
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          {t.common.checkAll}
        </Checkbox>
      )}

      <Form.Item name={name} noStyle>
        <Checkbox.Group options={options} />
      </Form.Item>
    </Form.Item>
  );
};
