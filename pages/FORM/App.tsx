import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { Loading, ProgramTitle } from "@core/components/common";
import * as React from "react";
import { useCallback } from "react";
import { AXFIRevert, AXFIWriteForm } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { FormSet } from "./FormSet";
import { use$FORM$Store } from "./use$FORM$Store";
import { errorHandling, formErrorHandling } from "utils/errorHandling";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();
  const init = use$FORM$Store((s) => s.init);
  const reset = use$FORM$Store((s) => s.reset);
  const destroy = use$FORM$Store((s) => s.destroy);
  const saveSpinning = use$FORM$Store((s) => s.saveSpinning);
  const callSaveApi = use$FORM$Store((s) => s.callSaveApi);

  const [form] = Form.useForm();
  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (e) {
      await formErrorHandling(form);
      return;
    }

    try {
      await callSaveApi();
      await reset();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callSaveApi, form, reset]);

  useDidMountEffect(() => {
    (async () => {
      try {
        await init();
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
        <ProgramTitle icon={<AXFIWriteForm />} title={t.pages.example.form.title}>
          <Button icon={<AXFIRevert />} onClick={reset} size='small' type={"ghost"}>
            {t.button.reset}
          </Button>
        </ProgramTitle>
        <ButtonGroup compact>
          <Button onClick={reset}>{t.button.reset}</Button>
          <Button type={"primary"} loading={saveSpinning} onClick={handleSave}>
          {t.button.save}
          </Button>
        </ButtonGroup>
      </Header>

      <FormSet form={form} />

      <Loading active={saveSpinning} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
