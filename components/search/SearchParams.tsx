import * as React from "react";
import styled from "@emotion/styled";
import { Form, FormInstance, Space } from "antd";
import { AXFIArrowDown, AXFIArrowUp } from "@axframe/icon";
import { IconText } from "@core/components/common";
import { SMixinFlexRow } from "@core/styles/emotion";
import { PageLayout } from "styles/pageStyled";
import { DateType, SearchParam, SearchParamOption, SearchParamType } from "./SearchParam";
import { getDayJsRangeValue } from "../../utils/object";
import dayjs from "dayjs";
import { deleteEmptyValue } from "../../utils/object/deleteEmptyValue";

export interface IParam {
  name: string;
  placeholder?: string;
  type: SearchParamType;
  options?: SearchParamOption[];
  label?: string;
  width?: number;
  checkAllItem?: boolean;
  loading?: boolean;
  picker?: DateType;
  onSearch?: () => Promise<SearchParamOption[]>;
  config?: Record<string, any>;
}

export interface ParamsValue extends Record<string, any> {
  filter?: string;
}

interface Props {
  form: FormInstance<any>;
  params?: IParam[];
  paramsValue?: ParamsValue;
  onChangeParamsValue?: (paramsValue: Record<string, any>, changedValues?: Record<string, any>) => void;
  onSearch?: () => void;
  children?: React.ReactNode;
  expand?: boolean;
  onChangeExpand?: (expand: boolean) => void;
  spinning?: boolean;
  extraButtons?: React.FC;
}

export function SearchParams({
  form,
  params,
  paramsValue,
  onChangeParamsValue,
  onSearch,
  children,
  expand,
  onChangeExpand,
  spinning,
  extraButtons: ExtraButtons,
}: Props) {
  const [showChildren, setShowChildren] = React.useState(false);

  const handleSearch = React.useCallback(() => {
    onSearch?.();
  }, [onSearch]);

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      onChangeParamsValue?.(values, changedValues);
    },
    [onChangeParamsValue]
  );

  const onClickExtraButton = React.useCallback(
    (params: Record<string, any>) => {
      form.setFieldsValue(params);
      onChangeParamsValue?.(form.getFieldsValue());
    },
    [form, onChangeParamsValue]
  );

  const toggleShowExtraParam = React.useCallback(() => {
    onChangeExpand?.(!showChildren);
    setShowChildren(!showChildren);
  }, [onChangeExpand, showChildren]);

  // 전체 선택 시 커스텀 처리
  const onChangedComponentValue = React.useCallback(() => {
    onValuesChange(undefined, form.getFieldsValue());
  }, [form, onValuesChange]);

  React.useEffect(() => {
    const formValues = {
      filterType: paramsValue?.filterType,
      filter: paramsValue?.filter,
    };

    params?.forEach((filter) => {
      if (filter.type === SearchParamType.TIME_RANGE) {
        formValues[filter.name] = getDayJsRangeValue(paramsValue?.[filter.name]);
      } else if (filter.type === SearchParamType.DATE) {
        formValues[filter.name] = paramsValue?.[filter.name] ? dayjs(paramsValue?.[filter.name]) : undefined;
      } else if (filter.type === SearchParamType.VALUES_FINDER) {
        formValues[filter.name] = paramsValue?.[filter.name] ?? [];
      } else {
        formValues[filter.name] = paramsValue?.[filter.name] ?? "";
      }
    });

    form.setFieldsValue(deleteEmptyValue(formValues));

    if (expand !== undefined) {
      setShowChildren(expand);
    }
  }, [form, params, paramsValue, expand]);

  return (
    <Form
      layout='horizontal'
      colon={false}
      form={form}
      onValuesChange={onValuesChange}
      onFinish={handleSearch}
      scrollToFirstError
    >
      <Container>
        <DefaultWrap role={"page-search-bar"}>
          {params && params?.length > 0 && (
            <Space wrap align={"center"}>
              {params.map((param, idx) => (
                <SearchParam
                  key={idx}
                  name={param.name}
                  placeholder={param.placeholder}
                  type={param.type}
                  value={paramsValue?.[param.name]}
                  options={param.options}
                  onClickExtraButton={onClickExtraButton}
                  label={param.label}
                  checkAllItem={param.checkAllItem}
                  width={param.width}
                  onChangedComponentValue={onChangedComponentValue}
                  loading={param.loading}
                  picker={param.picker}
                  onSearch={param.onSearch}
                  config={param.config}
                />
              ))}
            </Space>
          )}

          {ExtraButtons && (
            <Buttons>
              <ExtraButtons />
            </Buttons>
          )}
          {children && (
            <Buttons>
              <IconText
                icon={showChildren ? <AXFIArrowUp fontSize={18} /> : <AXFIArrowDown fontSize={18} />}
                onClick={toggleShowExtraParam}
              />
            </Buttons>
          )}
        </DefaultWrap>
        {children && showChildren && <FormBox>{children}</FormBox>}
      </Container>
      <button type='submit' style={{ display: "none" }} />
    </Form>
  );
}

const Container = styled.div`
  flex: 1;
`;

const DefaultWrap = styled.div`
  ${SMixinFlexRow("stretch", "center")};
  gap: 10px;
  margin-bottom: 15px;
  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-form-item .ant-form-item-label > label {
    min-width: 60px;
  }
`;

const SearchInput = styled.div`
  flex: 1;

  .ant-input-group.ant-input-group-compact {
    ${SMixinFlexRow("stretch", "center")};
  }
`;

const Buttons = styled.div`
  ${SMixinFlexRow("flex-start", "center")};
  flex: none;
  gap: 5px;
`;

const FormBox = styled(PageLayout.ContentBox)`
  margin-top: 10px;
  margin-bottom: 15px;

  > * {
    max-width: none;
  }
`;
