import * as React from "react";
import styled from "@emotion/styled";
import { ColResizer, IconText } from "@core/components/common";
import { AXFIDefaultProgram } from "@axframe/icon";
import { Button } from "antd";

import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n } from "@core/hooks";
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";
import { ListDataSet } from "./ListDataSet";
import { SubListDataSet } from "./SubListDataSet";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = use$LIST_WITH_LIST$Store((s) => s.init);
  const reset = use$LIST_WITH_LIST$Store((s) => s.reset);
  const callListApi = use$LIST_WITH_LIST$Store((s) => s.callListApi);

  const setFlexGrow = use$LIST_WITH_LIST$Store((s) => s.setFlexGrow);
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
        <IconText icon={<AXFIDefaultProgram />}>{t.pages.example.listWithList.title}</IconText>

        <ButtonGroup compact>
          <Button size='small' onClick={() => {}}>
            {t.button.excel}
          </Button>
          <Button size='small' onClick={handleReset}>
            {t.button.reset}
          </Button>
        </ButtonGroup>
      </Header>

      <Body ref={resizerContainerRef}>
        <ListDataSet />
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <SubListDataSet />
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

export default App;
