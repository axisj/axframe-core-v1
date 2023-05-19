import * as React from "react";
import { SearchParamSelect } from "./SearchParamSelect";
import { SearchParamDateRange } from "./SearchParamDateRange";
import { SearchParamCheckbox } from "./SearchParamCheckbox";
import { SearchParamInput } from "./SearchParamInput";
import { SearchParamDate } from "./SearchParamDate";
import { SearchParamValuesFinder } from "./SearchParamValuesFinder";
import { SearchParamSubmitButton } from "./SearchParamSubmitButton";
import { SearchParamButton } from "./SearchParamButton";
import { IParam } from "./SearchParams";
import { SearchParamTimeRange } from "./SearchParamTimeRange";

export enum SearchParamType {
  INPUT,
  DATE_RANGE,
  TIME_RANGE,
  SELECT,
  CHECKBOX,
  DATE,
  VALUES_FINDER,
  SUBMIT_BUTTON,
  BUTTON,
}
export type DateType = "date" | "week" | "month" | "quarter" | "year";

export interface SearchParamOption {
  value: string;
  label: React.ReactNode;
}

interface Props extends IParam {
  value: any;
  onClickExtraButton?: (params: Record<string, any>) => void;
  onChangedComponentValue?: () => void;
}

export type SearchParamComponentProp<R> = {
  [key in SearchParamType]: R;
};

export type SearchParamComponent = React.FC<Props>;

const SearchParamComponents: SearchParamComponentProp<SearchParamComponent> = {
  [SearchParamType.INPUT]: SearchParamInput,
  [SearchParamType.DATE_RANGE]: SearchParamDateRange,
  [SearchParamType.TIME_RANGE]: SearchParamTimeRange,
  [SearchParamType.SELECT]: SearchParamSelect,
  [SearchParamType.CHECKBOX]: SearchParamCheckbox,
  [SearchParamType.DATE]: SearchParamDate,
  [SearchParamType.VALUES_FINDER]: SearchParamValuesFinder,
  [SearchParamType.SUBMIT_BUTTON]: SearchParamSubmitButton,
  [SearchParamType.BUTTON]: SearchParamButton,
};

const SearchParam: SearchParamComponent = ({ type, width = 220, ...rest }) => {
  const Comp = SearchParamComponents[type];
  return <Comp type={type} width={width} {...rest} />;
};

export { SearchParam };
