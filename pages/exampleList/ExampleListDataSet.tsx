import * as React from "react";
import styled from "@emotion/styled";
import { SearchParams, SearchParamType } from "@core/components/search";
import { useI18n } from "@core/hooks/useI18n";
import { Form } from "antd";
import { ExampleListDataGrid } from "./ExampleListDataGrid";
import { useExampleListStore } from "./useExampleListStore";
import { SMixinFlexColumn } from "@core/styles/emotion";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { ROUTES } from "../../../router/Routes";
import { useLink } from "@core/hooks/useLink";

interface Props {}

function ExampleListDataSet({}: Props) {
  const { t } = useI18n();
  const { linkByRoute } = useLink();
  const listRequestValue = useExampleListStore((s) => s.listRequestValue);
  const setListRequestValue = useExampleListStore((s) => s.setListRequestValue);
  const callApi = useExampleListStore((s) => s.callListApi);
  const spinning = useExampleListStore((s) => s.listSpinning);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callApi();
  }, [callApi]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<ExampleItem>) => {
      linkByRoute(ROUTES.EXAMPLES.children.LIST_DETAIL.children.DETAIL, { id: params.item.id });
    },
    [linkByRoute]
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
        spinning={spinning}
      />

      <ExampleListDataGrid onClick={onClickItem} />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  flex: 1;
  ${SMixinFlexColumn("stretch", "stretch")};
`;

export { ExampleListDataSet };
