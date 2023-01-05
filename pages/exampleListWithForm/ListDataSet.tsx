import * as React from "react";
import styled from "@emotion/styled";
import { SearchParams, SearchParamType } from "@core/components/search";
import { useI18n } from "@core/hooks/useI18n";
import { Form } from "antd";
import { ListDataGrid } from "./ListDataGrid";
import { useExampleListWithFormStore } from "./useExampleListWithFormStore";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { PageLayout } from "styles/pageStyled";

interface Props {}

function ListDataSet({}: Props) {
  const { t } = useI18n();
  const listRequestValue = useExampleListWithFormStore((s) => s.listRequestValue);
  const setListRequestValue = useExampleListWithFormStore((s) => s.setListRequestValue);
  const callListApi = useExampleListWithFormStore((s) => s.callListApi);
  const listSpinning = useExampleListWithFormStore((s) => s.listSpinning);
  const setListSelectedRowKey = useExampleListWithFormStore((s) => s.setListSelectedRowKey);
  const flexGrow = useExampleListWithFormStore((s) => s.flexGrow);

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
  padding: 0 15px 30px 30px;
`;

export { ListDataSet };
