import * as React from "react";
import styled from "@emotion/styled";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button } from "antd";
import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect, useI18n } from "@core/hooks";
import { use$LIST_WITH_FORM$Store } from "./use$LIST_WITH_FORM$Store";
import { ListDataSet } from "./ListDataSet";
import { FormSet } from "./FormSet";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = use$LIST_WITH_FORM$Store((s) => s.init);
  const reset = use$LIST_WITH_FORM$Store((s) => s.reset);
  const callListApi = use$LIST_WITH_FORM$Store((s) => s.callListApi);
  const setFlexGrow = use$LIST_WITH_FORM$Store((s) => s.setFlexGrow);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleReset = React.useCallback(async () => {
    reset();
    await callListApi();
  }, [callListApi, reset]);

  useDidMountEffect(() => {
    init();
    callListApi();
  });

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <ProgramTitle title={t.pages.example.listWithForm.title}>
          <Button icon={<AXFIRevert />} onClick={handleReset} size='small' type={"ghost"}>
            {t.button.reset}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact></ButtonGroup>
      </Header>

      <Body ref={resizerContainerRef}>
        <ListDataSet />
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <FormSet />
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const Body = styled(PageLayout.FrameRow)`
  padding: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
