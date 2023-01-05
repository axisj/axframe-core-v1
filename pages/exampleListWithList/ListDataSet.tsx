import * as React from "react";
import styled from "@emotion/styled";
import { SearchParams, SearchParamType } from "@core/components/search";
import { useI18n } from "@core/hooks/useI18n";
import { Form } from "antd";
import { ListDataGrid } from "./ListDataGrid";
import { useExampleListWithListStore } from "./useExampleListWithListStore";
import { SMixinFlexColumn } from "@core/styles/emotion";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";

interface Props {}

function ListDataSet({}: Props) {
  const { t } = useI18n();
  const listRequestValue = useExampleListWithListStore((s) => s.listRequestValue);
  const setListRequestValue = useExampleListWithListStore((s) => s.setListRequestValue);
  const callListApi = useExampleListWithListStore((s) => s.callListApi);
  const listSpinning = useExampleListWithListStore((s) => s.listSpinning);
  const setListSelectedRowKey = useExampleListWithListStore((s) => s.setListSelectedRowKey);

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
    <Container>
      <SearchParams
        form={searchForm}
        params={params}
        paramsValue={listRequestValue}
        onChangeParamsValue={(value) => setListRequestValue(value)}
        onSearch={handleSearch}
        spinning={listSpinning}
      />

      <ListDataGrid onClick={onClickItem} />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  flex: 1;
  ${SMixinFlexColumn("stretch", "stretch")};
`;

export { ListDataSet };
