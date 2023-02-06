import * as React from "react";
import { SearchParamSelect } from "./SearchParamSelect";
import { SearchParamTimeRange } from "./SearchParamTimeRange";
import { SearchParamCheckbox } from "./SearchParamCheckbox";
import { SearchParamInput } from "./SearchParamInput";

export enum SearchParamType {
  INPUT,
  TIME_RANGE,
  SELECT,
  CHECKBOX,
}

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
  onChangedCheckAllItem?: () => void;
  width?: number;
  loading?: boolean;
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
};

const SearchParam: SearchParamComponent = (props) => {
  const Comp = SearchParamComponents[props.type];
  return <Comp {...props} />;
};

export { SearchParam };
