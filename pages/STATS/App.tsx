import * as React from "react";
import styled from "@emotion/styled";
import { ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form } from "antd";
import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { use$STATS$Store } from "./use$STATS$Store";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = use$STATS$Store((s) => s.init);
  const reset = use$STATS$Store((s) => s.reset);
  const destroy = use$STATS$Store((s) => s.destroy);
  const callListApi = use$STATS$Store((s) => s.callListApi);
  const callSaveApi = use$STATS$Store((s) => s.callSaveApi);
  const setFlexGrow = use$STATS$Store((s) => s.setFlexGrow);
  const requestValue = use$STATS$Store((s) => s.requestValue);
  const setRequestValue = use$STATS$Store((s) => s.setRequestValue);
  const spinning = use$STATS$Store((s) => s.spinning);
  const setListSelectedRowKey = use$STATS$Store((s) => s.setListSelectedRowKey);
  const flexGrow = use$STATS$Store((s) => s.flexGrow);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const [searchForm] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    reset();
    await callListApi();
  }, [callListApi, reset]);

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

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
        <Frame style={{ flex: flexGrow }}></Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const Body = styled(PageLayout.FrameRow)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
