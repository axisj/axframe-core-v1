import styled from "@emotion/styled";
import { Loading, ProgramTitle } from "@core/components/common";
import * as React from "react";
import { PageLayout } from "styles/pageStyled";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { View } from "./View";
import { use$DETAIL$Store } from "./use$DETAIL$Store";
import { useParams } from "react-router-dom";
import { errorHandling } from "../../../utils/errorHandling";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = use$DETAIL$Store((s) => s.init);
  const destroy = use$DETAIL$Store((s) => s.destroy);
  const callDetailApi = use$DETAIL$Store((s) => s.callDetailApi);
  const detailSpinning = use$DETAIL$Store((s) => s.detailSpinning);
  const urlParams = useParams<{ id: string }>();

  useDidMountEffect(() => {
    (async () => {
      try {
        await init();
        if (urlParams.id) await callDetailApi({ id: urlParams.id });
      } catch (e: any) {
        await errorHandling(e);
      }
    })();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container>
      <Header>
        <ProgramTitle title={t.pages.example.detail.title}></ProgramTitle>

        <ButtonGroup compact></ButtonGroup>
      </Header>

      <View />

      <Loading active={detailSpinning} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
