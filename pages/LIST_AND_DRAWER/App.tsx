import styled from "@emotion/styled";
import { Button, Form, message } from "antd";
import { ProgramTitle } from "@core/components/common";
import * as React from "react";
import { AXFIListSearch, AXFIRevert } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { use$LIST_AND_DRAWER$Store } from "./use$LIST_AND_DRAWER$Store";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { AXFDGClickParams } from "@axframe/datagrid";
import { openDetailDrawer } from "./DetailDrawer";
import { ListDataGrid } from "./ListDataGrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { errorHandling } from "utils/errorHandling";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n();
  const init = use$LIST_AND_DRAWER$Store((s) => s.init);
  const reset = use$LIST_AND_DRAWER$Store((s) => s.reset);
  const destroy = use$LIST_AND_DRAWER$Store((s) => s.destroy);
  const callListApi = use$LIST_AND_DRAWER$Store((s) => s.callListApi);
  const listRequestValue = use$LIST_AND_DRAWER$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST_AND_DRAWER$Store((s) => s.setListRequestValue);
  const listSpinning = use$LIST_AND_DRAWER$Store((s) => s.listSpinning);

  const [searchForm] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    try {
      await reset();
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi, reset]);

  const handleSearch = React.useCallback(async () => {
    try {
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi]);

  const onClickItem = React.useCallback(async (params: AXFDGClickParams<DtoItem>) => {
    try {
      const data = await openDetailDrawer({ query: params.item });
      message.info(JSON.stringify(data ?? {}));
    } catch (err) {
      console.log(err);
    }
  }, []);

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
          placeholder: t.pages.example.form.cnsltDt.placeholder,
          name: "timeRange",
          type: SearchParamType.DATE_RANGE,
        },
      ] as IParam[],
    [t]
  );

  useDidMountEffect(() => {
    (async () => {
      try {
        await init();
        await callListApi();
      } catch (e) {
        await errorHandling(e);
      }
    })();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <ProgramTitle icon={<AXFIListSearch />} title={t.pages.example.listAndDrawer.title}>
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
          spinning={listSpinning}
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
