import * as React from "react";
import styled from "@emotion/styled";
import { ColResizer, IconText } from "../../components/common";
import { AXFIListSearch } from "@axframe/icon";
import { Button } from "antd";

import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "../../hooks/useDidMountEffect";
import { ROUTES } from "../../../router/Routes";
import { useI18n } from "../../hooks/useI18n";
import { useExampleListWithListStore } from "./useExampleListWithListStore";
import { ListDataSet } from "./ListDataSet";
import { SubListDataSet } from "./SubListDataSet";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();

  const init = useExampleListWithListStore((s) => s.init);
  const reset = useExampleListWithListStore((s) => s.reset);
  const callListApi = useExampleListWithListStore((s) => s.callListApi);
  const flexGrow = useExampleListWithListStore((s) => s.flexGrow);
  const setFlexGrow = useExampleListWithListStore((s) => s.setFlexGrow);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleReset = React.useCallback(async () => {
    reset();
    await callListApi();
  }, [callListApi, reset]);

  useDidMountEffect(() => {
    init(ROUTES.EXAMPLES.children.LIST_WITH_LIST.path);
    callListApi();
  });

  console.log("flexGrow", flexGrow);

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <IconText icon={<AXFIListSearch />}>{t.pages.example.list.title}</IconText>

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
        <Frame style={{ flex: flexGrow }}>
          <ListDataSet />
        </Frame>
        <ColResizer margin={15} containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: 2 - flexGrow }}>
          <SubListDataSet />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const Body = styled(PageLayout.FrameRow)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
