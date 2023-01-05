import * as React from "react";
import styled from "@emotion/styled";
import { SearchParams, SearchParamType } from "@core/components/search";
import { useI18n } from "@core/hooks/useI18n";
import { Form, message } from "antd";
import { ExampleListAndDrawerDataGrid } from "./ExampleListAndDrawerDataGrid";
import { useExampleListAndDrawerStore } from "./useExampleListAndDrawerStore";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { openExampleDrawer } from "./ExampleDrawer";
import { PageLayout } from "styles/pageStyled";

interface Props {}

function ExampleListAndDrawerDataSet({}: Props) {
  const { t } = useI18n();
  // const { linkByRoute } = useLink();
  const listRequestValue = useExampleListAndDrawerStore((s) => s.listRequestValue);
  const setListRequestValue = useExampleListAndDrawerStore((s) => s.setListRequestValue);
  const callListApi = useExampleListAndDrawerStore((s) => s.callListApi);
  const listSpinning = useExampleListAndDrawerStore((s) => s.listSpinning);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

  const onClickItem = React.useCallback(async (params: AXFDGClickParams<ExampleItem>) => {
    try {
      const data = await openExampleDrawer({ query: params.item });
      message.info(JSON.stringify(data ?? {}));
    } catch (err) {
      console.log(err);
    }
  }, []);

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
    <Body>
      <SearchParams
        form={searchForm}
        params={params}
        paramsValue={listRequestValue}
        onChangeParamsValue={(value) => setListRequestValue(value)}
        onSearch={handleSearch}
        spinning={listSpinning}
      />

      <ExampleListAndDrawerDataGrid onClick={onClickItem} />
    </Body>
  );
}

const Body = styled(PageLayout.Body)``;

export { ExampleListAndDrawerDataSet };
