import * as React from "react";
import styled from "@emotion/styled";
import { SearchParams, SearchParamType } from "@core/components/search";
import { useI18n } from "@core/hooks";
import { Form } from "antd";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { PageLayout } from "styles/pageStyled";

interface Props {}

function ListDataSet({}: Props) {
  const { t } = useI18n();
  const listRequestValue = use$LIST_WITH_LIST$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST_WITH_LIST$Store((s) => s.setListRequestValue);
  const callListApi = use$LIST_WITH_LIST$Store((s) => s.callListApi);
  const listSpinning = use$LIST_WITH_LIST$Store((s) => s.listSpinning);
  const setListSelectedRowKey = use$LIST_WITH_LIST$Store((s) => s.setListSelectedRowKey);
  const flexGrow = use$LIST_WITH_LIST$Store((s) => s.flexGrow);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<ExampleItem>) => {
      setListSelectedRowKey(params.item.id);
    },
    [setListSelectedRowKey]
  );

  const params = React.useMemo(
    () => [
      {
        title: t.formItem.counseling.area.label,
        name: "select1",
        type: SearchParamType.SELECT,
        options: t.formItem.counseling.area.options,
      },
      {
        title: t.formItem.counseling.cnsltHow.label,
        name: "select2",
        type: SearchParamType.SELECT,
        options: t.formItem.counseling.cnsltHow.options,
      },
      {
        title: t.formItem.counseling.cnsltDt.label,
        name: "timeRange",
        type: SearchParamType.TIME_RANGE,
      },
    ],
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
