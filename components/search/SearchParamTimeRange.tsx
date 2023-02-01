import dayjs, { Dayjs } from "dayjs";
import * as React from "react";
import { SearchParamComponent } from "./SearchParam";
import { DatePicker, Form, Space, Button } from "antd";

enum RangeType {
  TODAY = "TODAY",
  D3 = "D3",
  D7 = "D7",
}

export const SearchParamTimeRange: SearchParamComponent = ({ name, onClickExtraButton, label }) => {
  const onClickButton = React.useCallback(
    (rangeType: RangeType) => {
      let range: Dayjs[] = [];
      switch (rangeType) {
        case RangeType.D3:
          range = [dayjs().add(-3, "d"), dayjs()];
          break;
        case RangeType.D7:
          range = [dayjs().add(-7, "d"), dayjs()];
          break;
        case RangeType.TODAY:
          range = [dayjs(), dayjs()];
          break;
      }

      onClickExtraButton?.({ [name]: range });
    },
    [name, onClickExtraButton]
  );

  return (
    <Form.Item name={name} {...(label ? { label } : { noStyle: true })}>
      <DatePicker.RangePicker
        style={{ width: 240 }}
        showNow
        renderExtraFooter={() => (
          <Space direction={"horizontal"} size={4}>
            <Button type={"link"} size='small' onClick={() => onClickButton(RangeType.TODAY)}>
              Today
            </Button>
            <Button type={"link"} size='small' onClick={() => onClickButton(RangeType.D3)}>
              3D
            </Button>
            <Button type={"link"} size='small' onClick={() => onClickButton(RangeType.D7)}>
              7D
            </Button>
          </Space>
        )}
      />
    </Form.Item>
  );
};
