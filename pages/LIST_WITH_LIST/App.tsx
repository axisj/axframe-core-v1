import * as React from "react";
import styled from "@emotion/styled";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form } from "antd";

import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n } from "@core/hooks";
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";
import { IParam, SearchParams, SearchParamType } from "../../components/search";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "../../services/example/ExampleRepositoryInterface";
import { ListDataGrid } from "./ListDataGrid";
import { ChildListDataGrid } from "./ChildListDataGrid";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = use$LIST_WITH_LIST$Store((s) => s.init);
  const reset = use$LIST_WITH_LIST$Store((s) => s.reset);
  const callListApi = use$LIST_WITH_LIST$Store((s) => s.callListApi);
  const callSaveApi = use$LIST_WITH_LIST$Store((s) => s.callSaveApi);
  const setFlexGrow = use$LIST_WITH_LIST$Store((s) => s.setFlexGrow);
  const requestValue = use$LIST_WITH_LIST$Store((s) => s.requestValue);
  const setRequestValue = use$LIST_WITH_LIST$Store((s) => s.setRequestValue);
  const spinning = use$LIST_WITH_LIST$Store((s) => s.spinning);
  const setListSelectedRowKey = use$LIST_WITH_LIST$Store((s) => s.setListSelectedRowKey);
  const flexGrow = use$LIST_WITH_LIST$Store((s) => s.flexGrow);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const [searchForm] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    reset();
    await callListApi();
  }, [callListApi, reset]);

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      if (params.item.id) setListSelectedRowKey(params.item.id, params.item);
    },
    [setListSelectedRowKey]
  );

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

  useDidMountEffect(() => {
    init();
    callListApi();
  });

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <ProgramTitle title={t.pages.example.listWithList.title}>
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
            type={"primary"}
            onClick={() => {
              callSaveApi();
            }}
          >
            {t.button.save}
          </Button>
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={requestValue}
          onChangeParamsValue={(value) => setRequestValue(value)}
          onSearch={handleSearch}
          spinning={spinning}
          disableFilter
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: flexGrow }}>
          <ListDataGrid onClick={onClickItem} />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: 2 - flexGrow }}>
          <ChildListDataGrid />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const Body = styled(PageLayout.FrameRow)`
  padding-top: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Frame = styled(PageLayout.FrameColumn)`
  padding-top: 0;
`;

export default App;
