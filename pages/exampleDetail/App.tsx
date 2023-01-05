import styled from "@emotion/styled";
import { IconText, Loading } from "@core/components/common";
import * as React from "react";
import { AXFIWriteForm } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks/useI18n";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { ExampleDetailView } from "./ExampleDetailView";
import { useExampleDetailStore } from "./useExampleDetailStore";
import { useParams } from "react-router-dom";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = useExampleDetailStore((s) => s.init);
  const callDetailApi = useExampleDetailStore((s) => s.callDetailApi);
  const detailSpinning = useExampleDetailStore((s) => s.detailSpinning);
  const urlParams = useParams<{ id: string }>();

  useDidMountEffect(() => {
    init();
    if (urlParams.id) callDetailApi({ id: urlParams.id });
  });

  return (
    <Container>
      <Header>
        <IconText icon={<AXFIWriteForm />}>{t.pages.counseling.registration.title}</IconText>

        <ButtonGroup compact>
          {/*<Button size='small' onClick={reset}>*/}
          {/*  {t.button.reset}*/}
          {/*</Button>*/}
        </ButtonGroup>
      </Header>

      <ExampleDetailView />

      <Loading active={detailSpinning} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
