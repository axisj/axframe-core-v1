import * as React from "react";
import styled from "@emotion/styled";
import { Form, Input } from "antd";
import { phoneNumFormatter, phoneNumParser } from "../utils/antd";

interface Props {
  name: string;
  label: string;
  onChange: (value: string) => void;
}

function InputPhoneNumber({ label, name, onChange }: Props) {
  const form = Form.useFormInstance();
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    // setValue(form.getFieldValue(name));
  }, []);

  return (
    <Form.Item label={label} name={name} initialValue={value}>
      <Input
        onChange={(e) => {
          // console.log("v", phoneNumFormatter(phoneNumParser(e.target.value)));
          const target = e.target as HTMLInputElement;
          const selectionStart = target.selectionStart ?? target.value.length;

          const _v = target.value;
          target.value = phoneNumFormatter(phoneNumParser(target.value));

          if (target.value.length > _v.length) {
            target.setRangeText("", selectionStart + 1, selectionStart + 1, "end");
          } else {
            target.setRangeText("", selectionStart, selectionStart, "start");
          }
        }}
      />
    </Form.Item>
  );
}

export { InputPhoneNumber };
