import * as React from "react";
import { useCallback } from "react";
import styled from "@emotion/styled";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form } from "antd";
import { PageLayout } from "styles/pageStyled";
import { useDialog, useDidMountEffect, useI18n, useUnmountEffect } from "@core/hooks";
import { use$LIST_WITH_FORM_LIST$Store } from "./use$LIST_WITH_FORM_LIST$Store";
import { FormSet } from "./FormSet";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { ListDataGrid } from "./ListDataGrid";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n();
  const { errorDialog } = useDialog();

  const init = use$LIST_WITH_FORM_LIST$Store((s) => s.init);
  const reset = use$LIST_WITH_FORM_LIST$Store((s) => s.reset);
  const destroy = use$LIST_WITH_FORM_LIST$Store((s) => s.destroy);
  const callListApi = use$LIST_WITH_FORM_LIST$Store((s) => s.callListApi);
  const setFlexGrow = use$LIST_WITH_FORM_LIST$Store((s) => s.setFlexGrow);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const listRequestValue = use$LIST_WITH_FORM_LIST$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST_WITH_FORM_LIST$Store((s) => s.setListRequestValue);
  const listSpinning = use$LIST_WITH_FORM_LIST$Store((s) => s.listSpinning);
  const cancelFormActive = use$LIST_WITH_FORM_LIST$Store((s) => s.cancelFormActive);
  const setFormActive = use$LIST_WITH_FORM_LIST$Store((s) => s.setFormActive);
  const setListSelectedRowKey = use$LIST_WITH_FORM_LIST$Store((s) => s.setListSelectedRowKey);
  const flexGrow = use$LIST_WITH_FORM_LIST$Store((s) => s.flexGrow);
  const saveSpinning = use$LIST_WITH_FORM_LIST$Store((s) => s.saveSpinning);
  const callSaveApi = use$LIST_WITH_FORM_LIST$Store((s) => s.callSaveApi);
  const formActive = use$LIST_WITH_FORM_LIST$Store((s) => s.formActive);
  const listSelectedRowKey = use$LIST_WITH_FORM_LIST$Store((s) => s.listSelectedRowKey);

  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    reset();
    try {
      await callListApi();
    } catch (e) {
      await errorDialog(e as any);
    }
  }, [callListApi, errorDialog, reset]);

  const handleSearch = React.useCallback(async () => {
    try {
      await callListApi();
    } catch (e) {
      await errorDialog(e as any);
    }
  }, [callListApi, errorDialog]);

  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
      await callSaveApi();
      await reset();
    } catch (e) {
      await errorDialog(e as any);
    }
  }, [form, callSaveApi, reset, errorDialog]);

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

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      setListSelectedRowKey(params.item.id, params.item);
    },
    [setListSelectedRowKey]
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
        <ProgramTitle title={t.pages.example.listWithForm.title}>
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
          <Button
            onClick={() => {
              cancelFormActive();
              setFormActive();
            }}
          >
            {t.button.addNew}
          </Button>
          <Button
            type={"primary"}
            loading={saveSpinning}
            disabled={!formActive && !listSelectedRowKey}
            onClick={handleSave}
          >
            {t.button.save}
          </Button>
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setListRequestValue(value)}
          onSearch={handleSearch}
          spinning={listSpinning}
          disableFilter
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: flexGrow }}>
          <ListDataGrid onClick={onClickItem} />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: 2 - flexGrow }} scroll>
          <FormSet form={form} />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Body = styled(PageLayout.FrameRow)`
  padding: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
