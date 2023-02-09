import * as React from "react";
import styled from "@emotion/styled";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useI18n } from "@core/hooks";
import { Form, message } from "antd";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST_AND_MODAL$Store } from "./use$LIST_AND_MODAL$Store";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { openDetailModal } from "./DetailModal";
import { PageLayout } from "styles/pageStyled";

interface DtoItem extends ExampleItem {}

interface Props {}

function ListDataSet({}: Props) {
  const { t } = useI18n();
  // const { linkByRoute } = useLink();
  const listRequestValue = use$LIST_AND_MODAL$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST_AND_MODAL$Store((s) => s.setListRequestValue);
  const callListApi = use$LIST_AND_MODAL$Store((s) => s.callListApi);
  const listSpinning = use$LIST_AND_MODAL$Store((s) => s.listSpinning);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

  const onClickItem = React.useCallback(async (params: AXFDGClickParams<DtoItem>) => {
    try {
      const data = await openDetailModal({
        query: params.item,
      });

      message.info(JSON.stringify(data ?? {}));
    } catch (err) {
      console.log(err);
    }
  }, []);

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
    <Body>
      <SearchParams
        form={searchForm}
        params={params}
        paramsValue={listRequestValue}
        onChangeParamsValue={(value) => setListRequestValue(value)}
        onSearch={handleSearch}
        spinning={listSpinning}
      />

      <ListDataGrid onClick={onClickItem} />
    </Body>
  );
}

const Body = styled(PageLayout.Body)``;

export { ListDataSet };
