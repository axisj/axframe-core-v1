import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { ProgramTitle } from "@core/components/common";
import * as React from "react";
import { AXFIRevert } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks/useI18n";
import { use$LIST$Store } from "./use$LIST$Store";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { ListDataGrid } from "./ListDataGrid";
import { useLink, useUnmountEffect } from "hooks";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ROUTES } from "router";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";

interface DtoItem extends ExampleItem {}
interface Props {}

function App({}: Props) {
  const { t } = useI18n();
  const { linkByRoute } = useLink();
  const init = use$LIST$Store((s) => s.init);
  const reset = use$LIST$Store((s) => s.reset);
  const destroy = use$LIST$Store((s) => s.destroy);
  const callListApi = use$LIST$Store((s) => s.callListApi);
  const listRequestValue = use$LIST$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST$Store((s) => s.setListRequestValue);
  const callApi = use$LIST$Store((s) => s.callListApi);
  const spinning = use$LIST$Store((s) => s.listSpinning);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callApi();
  }, [callApi]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      linkByRoute(ROUTES.EXAMPLES.children.LIST_DETAIL.children.DETAIL, { id: params.item.id });
    },
    [linkByRoute]
  );

  const handleReset = React.useCallback(async () => {
    reset();
    await callListApi();
  }, [callListApi, reset]);

  const params = React.useMemo(
    () =>
      [
        {
          placeholder: t.pages.example.form.area.label,
          name: "select1",
          type: SearchParamType.SELECT,
          options: t.pages.example.form.area.options,
        },
        {
          placeholder: t.pages.example.form.cnsltHow.label,
          name: "select2",
          type: SearchParamType.SELECT,
          options: t.pages.example.form.cnsltHow.options,
        },
        {
          placeholder: t.pages.example.form.cnsltDt.label,
          name: "timeRange",
          type: SearchParamType.TIME_RANGE,
        },
      ] as IParam[],
    [t]
  );

  useDidMountEffect(() => {
    init();
    callListApi();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <ProgramTitle title={t.pages.example.list.title}>
          <Button icon={<AXFIRevert />} onClick={handleReset} size='small' type={"ghost"}>
            {t.button.reset}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>
          <Button
            onClick={() => {
              callListApi();
            }}
          >
            {t.button.search}
          </Button>
        </ButtonGroup>
      </Header>

      <Body>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setListRequestValue(value)}
          onSearch={handleSearch}
          spinning={spinning}
          disableFilter
        />
        <ListDataGrid onClick={onClickItem} />
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Body = styled(PageLayout.Body)``;

export default App;
