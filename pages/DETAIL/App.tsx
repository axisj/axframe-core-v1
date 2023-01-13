import styled from "@emotion/styled";
import { IconText, Loading } from "@core/components/common";
import * as React from "react";
import { AXFIDefaultProgram } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { View } from "./View";
import { use$DETAIL$Store } from "./use$DETAIL$Store";
import { useParams } from "react-router-dom";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = use$DETAIL$Store((s) => s.init);
  const callDetailApi = use$DETAIL$Store((s) => s.callDetailApi);
  const detailSpinning = use$DETAIL$Store((s) => s.detailSpinning);
  const urlParams = useParams<{ id: string }>();

  useDidMountEffect(() => {
    init();
    if (urlParams.id) callDetailApi({ id: urlParams.id });
  });

  return (
    <Container>
      <Header>
        <IconText icon={<AXFIDefaultProgram />}>{t.pages.counseling.registration.title}</IconText>

        <ButtonGroup compact>
          {/*<Button size='small' onClick={reset}>*/}
          {/*  {t.button.reset}*/}
          {/*</Button>*/}
        </ButtonGroup>
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
