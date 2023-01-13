import * as React from "react";
import styled from "@emotion/styled";
import { Button, Form, FormInstance, Input } from "antd";
import { AXFIArrowDown, AXFIArrowUp, AXFISearch } from "@axframe/icon";
import { IconText, Spinner } from "@core/components/common";
import { SMixinFlexRow } from "@core/styles/emotion";
import { PageLayout } from "styles/pageStyled";
import { SearchParam, SearchParamOption, SearchParamType } from "./SearchParam";
import moment from "moment";
import { getMomentRangeValue } from "../../utils/object";
import { css } from "@emotion/react";

export interface IParam {
  title: React.ReactNode;
  name: string;
  type: SearchParamType;
  options?: SearchParamOption[];
}

export interface ParamsValue extends Record<string, any> {
  filter?: string;
}

interface Props {
  form: FormInstance<any>;
  params?: IParam[];
  paramsValue?: ParamsValue;
  onChangeParamsValue?: (paramsValue: Record<string, any>) => void;
  onSearch?: () => void;
  children?: React.ReactNode;
  expand?: boolean;
  onChangeExpand?: (expand: boolean) => void;
  spinning?: boolean;
  filterWidth?: number;
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
  filterWidth,
  extraButtons: ExtraButtons,
}: Props) {
  const [showChildren, setShowChildren] = React.useState(false);

  const handleSearch = React.useCallback(() => {
    onSearch?.();
  }, [onSearch]);

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      onChangeParamsValue?.(values);
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

  React.useEffect(() => {
    const formValues = {
      filterType: paramsValue?.filterType,
      filter: paramsValue?.filter,
    };

    params?.forEach((filter) => {
      if (filter.type === SearchParamType.TIME_RANGE) {
        formValues[filter.name] = getMomentRangeValue(paramsValue?.[filter.name]);
      } else {
        formValues[filter.name] = paramsValue?.[filter.name] ?? "";
      }
    });

    form.setFieldsValue(formValues);

    if (expand !== undefined) {
      setShowChildren(expand);
    }
  }, [form, params, paramsValue, expand]);

  return (
    <Form layout='vertical' form={form} onValuesChange={onValuesChange} onFinish={handleSearch} scrollToFirstError>
      <Container>
        <DefaultWrap>
          {params && params?.length > 0 && (
            <Input.Group compact style={{ width: "auto" }}>
              {params.map((filter, idx) => (
                <SearchParam
                  key={idx}
                  name={filter.name}
                  title={filter.title}
                  type={filter.type}
                  value={paramsValue?.[filter.name]}
                  options={filter.options}
                  onClickExtraButton={onClickExtraButton}
                />
              ))}
            </Input.Group>
          )}

          <SearchInput>
            <Form.Item name={"filter"} noStyle>
              <Input.Search
                loading={spinning}
                placeholder={"search"}
                allowClear
                onSearch={handleSearch}
                style={{ width: filterWidth }}
              />
            </Form.Item>
          </SearchInput>

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
      <Button htmlType={"submit"} hidden />
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
