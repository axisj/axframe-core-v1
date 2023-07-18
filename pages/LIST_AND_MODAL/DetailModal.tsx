import styled from "@emotion/styled";
import { Badge, Button, Descriptions, message, Modal } from "antd";
import * as React from "react";
import { ModalLayout } from "styles/pageStyled";
import { useModalStore } from "@core/stores/useModalStore";
import { delay } from "@core/utils/thread/timing";
import { use$LIST_AND_MODAL$Store } from "./use$LIST_AND_MODAL$Store";
import { useDidMountEffect, useSpinning } from "@core/hooks";
import { Loading } from "@core/components/common";
import { useI18n } from "@core/hooks/useI18n";

export interface ModalRequest {
  query?: Record<string, any>;
}

export interface ModalResponse {
  save?: boolean;
  delete?: boolean;
}

interface Props {
  open: boolean;
  onOk: (value: ModalResponse) => ModalResponse;
  onCancel: (reason?: any) => void;
  params: ModalRequest;
  afterClose: () => void;
}

function DetailModal({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n();
  const { spinning, setSpinning, isBusy } = useSpinning<{ test: boolean; save: boolean; delete: boolean }>();

  const callDetailApi = use$LIST_AND_MODAL$Store((s) => s.callDetailApi);
  const detailSpinning = use$LIST_AND_MODAL$Store((s) => s.detailSpinning);
  const detail = use$LIST_AND_MODAL$Store((s) => s.detail);

  const handleTest = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ test: true });
    message.info("The test has been completed.");
    await delay(1000);
    setSpinning({ test: false });
  }, [setSpinning, isBusy]);

  const handleSave = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ save: true });
    await delay(1000);
    onOk({
      save: true,
    });
    setSpinning({ save: false });
  }, [onOk, setSpinning, isBusy]);

  const handleDelete = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ delete: true });
    await delay(300);
    onOk({
      delete: true,
    });
    setSpinning({ delete: false });
  }, [onOk, setSpinning, isBusy]);

  useDidMountEffect(() => {
    callDetailApi({ id: params.query?.id });
  });

  return (
    <Modal width={800} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={`샘플(상세#${params.query?.id})`}>
          <Button size={"small"} onClick={handleTest} loading={spinning?.test}>
            TEST
          </Button>
        </ModalLayout.Header>
        <Body>
          <Descriptions bordered size={"small"}>
            <Descriptions.Item label={t.pages.example.form.name.label}>{detail?.name}</Descriptions.Item>
            <Descriptions.Item label={t.pages.example.form.birthDt.label}>{detail?.birthDt}</Descriptions.Item>
            <Descriptions.Item label={t.pages.example.form.sex.label}>{detail?.sex}</Descriptions.Item>
            <Descriptions.Item label={t.pages.example.form.phone1.label}>{detail?.phone1}</Descriptions.Item>
            <Descriptions.Item label={t.pages.example.form.phone2.label} span={2}>
              {detail?.phone2}
            </Descriptions.Item>
            <Descriptions.Item label='Status' span={3}>
              <Badge status='processing' text='Running' />
            </Descriptions.Item>
            <Descriptions.Item label={t.pages.example.form.hndcapYn.label}>{detail?.hndcapYn}</Descriptions.Item>
            <Descriptions.Item label={t.pages.example.form.hndcapGrade.label}>{detail?.hndcapGrade}</Descriptions.Item>
            <Descriptions.Item label={t.pages.example.form.hndcapTyp.label}>{detail?.hndcapTyp}</Descriptions.Item>
          </Descriptions>

          <Loading active={detailSpinning} />
        </Body>
        <Footer>
          <Button type='primary' onClick={handleSave} loading={spinning?.save}>
            수정하기
          </Button>
          <Button onClick={handleDelete} loading={spinning?.delete}>
            삭제하기
          </Button>
          <Button onClick={onCancel}>취소</Button>
        </Footer>
      </Container>
    </Modal>
  );
}

const Container = styled(ModalLayout)``;
const Body = styled(ModalLayout.Body)``;
const Footer = styled(ModalLayout.Footer)``;

export async function openDetailModal(params: ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <DetailModal open={open} onOk={resolve} onCancel={onClose} afterClose={afterClose} params={params} />
  ));
}

export default DetailModal;
