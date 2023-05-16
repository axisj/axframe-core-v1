import * as React from "react";
import { SearchParamSelect } from "./SearchParamSelect";
import { SearchParamTimeRange } from "./SearchParamTimeRange";
import { SearchParamCheckbox } from "./SearchParamCheckbox";
import { SearchParamInput } from "./SearchParamInput";
import { SearchParamDate } from "./SearchParamDate";
import { SearchParamValuesFinder } from "./SearchParamValuesFinder";
import { SearchParamButton } from "./SearchParamButton";

export enum SearchParamType {
  INPUT,
  TIME_RANGE,
  SELECT,
  CHECKBOX,
  DATE,
  VALUES_FINDER,
  SUBMIT_BUTTON,
}
export type DateType = "date" | "week" | "month" | "quarter" | "year";

export interface SearchParamOption {
  value: string;
  label: React.ReactNode;
}

interface Props {
  name: string;
  placeholder?: string;
  type: SearchParamType;
  value: any;
  options?: SearchParamOption[];
  onClickExtraButton?: (params: Record<string, any>) => void;
  label?: string;
  checkAllItem?: boolean;
  onChangedComponentValue?: () => void;
  width?: number;
  loading?: boolean;
  picker?: DateType;
  onSearch?: () => Promise<SearchParamOption[]>;
  config?: Record<string, any>;
  disabled?: boolean;

  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

export type SearchParamComponentProp<R> = {
  [key in SearchParamType]: R;
};

export type SearchParamComponent = React.FC<Props>;

const SearchParamComponents: SearchParamComponentProp<SearchParamComponent> = {
  [SearchParamType.INPUT]: SearchParamInput,
  [SearchParamType.TIME_RANGE]: SearchParamTimeRange,
  [SearchParamType.SELECT]: SearchParamSelect,
  [SearchParamType.CHECKBOX]: SearchParamCheckbox,
  [SearchParamType.DATE]: SearchParamDate,
  [SearchParamType.VALUES_FINDER]: SearchParamValuesFinder,
  [SearchParamType.SUBMIT_BUTTON]: SearchParamButton,
};

const SearchParam: SearchParamComponent = ({ type, width = 220, ...rest }) => {
  const Comp = SearchParamComponents[type];
  return <Comp type={type} width={width} {...rest} />;
};

export { SearchParam };
