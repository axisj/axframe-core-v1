import * as React from "react";
import styled from "@emotion/styled";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form } from "antd";

import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n } from "@core/hooks";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";
import { IParam, SearchParams, SearchParamType } from "../../components/search";
import { ListDataGrid } from "./ListDataGrid";
import { SubListDataGrid } from "./SubListDataGrid";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = use$THREE_LIST$Store((s) => s.init);
  const reset = use$THREE_LIST$Store((s) => s.reset);
  const setFlexGrow = use$THREE_LIST$Store((s) => s.setFlexGrow);
  const listRequestValue = use$THREE_LIST$Store((s) => s.listRequestValue);
  const setListRequestValue = use$THREE_LIST$Store((s) => s.setListRequestValue);
  const callListApi = use$THREE_LIST$Store((s) => s.callListApi);
  const listSpinning = use$THREE_LIST$Store((s) => s.listSpinning);
  const flexGrow = use$THREE_LIST$Store((s) => s.flexGrow);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleReset = React.useCallback(async () => {
    reset();
    await callListApi();
  }, [callListApi, reset]);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

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
          <Button type={"primary"} onClick={() => {}}>
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
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: flexGrow }}>
          <ListDataGrid />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: 2 - flexGrow }}>
          <SubListDataGrid />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Body = styled(PageLayout.FrameRow)`
  padding-top: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Frame = styled(PageLayout.FrameColumn)`
  padding-top: 0;
`;

export default App;
