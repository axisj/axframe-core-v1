import { SelectProps } from "antd/lib/select";
import { expectFilter } from "@core/utils/string";
import { findOptionLabelValue } from "./findOptionLabelValue";

export const fnFilterLabel: SelectProps<string>["filterOption"] = (input, option) => {
  if (!option) {
    return false;
  }
  const optionLabel = (() => {
    const label = option.label ?? "";
    if (typeof label === "string" || typeof label === "number" || typeof label === "boolean") {
      return `${option.label}`;
    } else if ("children" in label) {
      return findOptionLabelValue(label) ?? "";
    }
    return `${option.value}`;
  })();

  return new RegExp(expectFilter(input), "i").test(optionLabel);
};
