import * as React from "react";
import styled from "@emotion/styled";
import { SearchParams, SearchParamType } from "@core/components/search";
import { useI18n, useLink } from "@core/hooks";
import { Form } from "antd";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST$Store } from "./use$LIST$Store";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { ROUTES } from "router/Routes";
import { PageLayout } from "styles/pageStyled";

interface Props {}

function ListDataSet({}: Props) {
  const { t } = useI18n();
  const { linkByRoute } = useLink();
  const listRequestValue = use$LIST$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST$Store((s) => s.setListRequestValue);
  const callApi = use$LIST$Store((s) => s.callListApi);
  const spinning = use$LIST$Store((s) => s.listSpinning);

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
    <Body>
      <SearchParams
        form={searchForm}
        params={params}
        paramsValue={listRequestValue}
        onChangeParamsValue={(value) => setListRequestValue(value)}
        onSearch={handleSearch}
        spinning={spinning}
      />

      <ListDataGrid onClick={onClickItem} />
    </Body>
  );
}

const Body = styled(PageLayout.Body)``;

export { ListDataSet };
