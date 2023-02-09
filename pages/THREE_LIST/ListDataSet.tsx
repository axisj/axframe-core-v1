import * as React from "react";
import styled from "@emotion/styled";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useI18n } from "@core/hooks";
import { Form } from "antd";
import { ListDataGrid } from "./ListDataGrid";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { PageLayout } from "styles/pageStyled";

interface DtoItem extends ExampleItem {}

interface Props {}

function ListDataSet({}: Props) {
  const { t } = useI18n();
  const listRequestValue = use$THREE_LIST$Store((s) => s.listRequestValue);
  const setListRequestValue = use$THREE_LIST$Store((s) => s.setListRequestValue);
  const callListApi = use$THREE_LIST$Store((s) => s.callListApi);
  const listSpinning = use$THREE_LIST$Store((s) => s.listSpinning);
  const setListSelectedRowKey = use$THREE_LIST$Store((s) => s.setListSelectedRowKey);
  const flexGrow = use$THREE_LIST$Store((s) => s.flexGrow);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      setListSelectedRowKey(params.item.id);
    },
    [setListSelectedRowKey]
  );

  const params = React.useMemo(
    () =>
      [
        {
          placeholder: t.formItem.example.area.label,
          name: "select1",
          type: SearchParamType.SELECT,
          options: t.formItem.example.area.options,
        },
        {
          placeholder: t.formItem.example.cnsltHow.label,
          name: "select2",
          type: SearchParamType.SELECT,
          options: t.formItem.example.cnsltHow.options,
        },
        {
          placeholder: t.formItem.example.cnsltDt.label,
          name: "timeRange",
          type: SearchParamType.TIME_RANGE,
        },
      ] as IParam[],
    [t]
  );

  return (
    <Frame style={{ flex: flexGrow }}>
      <SearchParams
        form={searchForm}
        params={params}
        paramsValue={listRequestValue}
        onChangeParamsValue={(value) => setListRequestValue(value)}
        onSearch={handleSearch}
        spinning={listSpinning}
      />
      <ListDataGrid onClick={onClickItem} />
    </Frame>
  );
}

const Frame = styled(PageLayout.FrameColumn)`
  padding-top: 0;
`;

export { ListDataSet };
