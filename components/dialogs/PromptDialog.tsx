import styled from "@emotion/styled";
import { Button, Form, Input, Modal } from "antd";
import * as React from "react";
import { ModalLayout } from "styles/pageStyled";
import { useModalStore } from "@core/stores/useModalStore";
import { useI18n } from "@core/hooks/useI18n";

export interface PromptDialogRequest {
  title: React.ReactNode;
  label: React.ReactNode;
  placeHolder?: string;
  keyName: string;
  dialogWidth?: number;
  value?: string;
}

export interface PromptDialogResponse {
  save?: boolean;
  delete?: boolean;
  data: Record<string, any>;
}

interface Props {
  open: boolean;
  onOk: (value: PromptDialogResponse) => PromptDialogResponse;
  onCancel: (reason?: any) => void;
  params: PromptDialogRequest;
  afterClose: () => void;
}

function PromptModal({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n();
  const [form] = Form.useForm();

  const handleSubmit = React.useCallback(() => {
    onOk({
      data: form.getFieldsValue(),
    });
  }, [form, onOk]);

  React.useEffect(() => {
    form.setFieldsValue({
      [params.keyName]: params.value,
    });
  }, [form, params.keyName, params.value]);

  return (
    <Modal width={params.dialogWidth ?? 500} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={params.title}></ModalLayout.Header>
        <Body>
          <Form form={form} layout={"vertical"} onFinish={handleSubmit}>
            <Form.Item name={params.keyName} label={params.label} rules={[{ required: true }]}>
              <Input placeholder={params.placeHolder} autoFocus />
            </Form.Item>
          </Form>
        </Body>
        <Footer>
          <Button type='primary' onClick={() => form.submit()}>
            {t.button.ok}
          </Button>
          <Button onClick={onCancel}>{t.button.cancel}</Button>
        </Footer>
      </Container>
    </Modal>
  );
}

const Container = styled(ModalLayout)``;
const Body = styled(ModalLayout.Body)`
  min-height: 50px;
`;
const Footer = styled(ModalLayout.Footer)``;

export async function openPromptDialog(params: PromptDialogRequest) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<PromptDialogResponse>((open, resolve, reject, onClose, afterClose) => (
    <PromptModal open={open} onOk={resolve} onCancel={onClose} afterClose={afterClose} params={params} />
  ));
}

export default PromptModal;
