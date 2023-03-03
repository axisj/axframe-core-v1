import { SelectProps } from "antd/lib/select";
import { findOptionLabelValue } from "./findOptionLabelValue";
import { expectFilter } from "@core/utils/string";

export const fnExactFilterOption: SelectProps<string>["filterOption"] = (input, option) => {
  if (!option) {
    return false;
  }
  const optionLabel =
    typeof option.props.children === "string" ? option.props.children : findOptionLabelValue(option.props.children);

  return new RegExp("^" + expectFilter(input), "i").test(optionLabel);
};
