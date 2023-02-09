import { Badge, Button, Descriptions, Drawer, message, Space } from "antd";
import * as React from "react";
import { useDrawerStore } from "@core/stores/useDrawerStore";
import { useDidMountEffect, useI18n, useSpinning } from "@core/hooks";
import { delay } from "@core/utils/thread/timing";
import { use$LIST_AND_DRAWER$Store } from "./use$LIST_AND_DRAWER$Store";
import { Loading } from "@core/components/common";

export interface ExampleDrawerRequest {
  query?: Record<string, any>;
}

export interface ExampleDrawerResponse {
  save?: boolean;
  delete?: boolean;
}

interface Props {
  open: boolean;
  onOk: (value: any) => ExampleDrawerResponse;
  onCancel: (reason?: any) => void;
  params: ExampleDrawerRequest;
  afterOpenChange: (open: boolean) => void;
}

function DetailDrawer({ open, onOk, onCancel, params, afterOpenChange }: Props) {
  const { t } = useI18n();
  const { spinning, setSpinning, isBusy } = useSpinning<{ test: boolean; save: boolean; delete: boolean }>();

  const callDetailApi = use$LIST_AND_DRAWER$Store((s) => s.callDetailApi);
  const detailSpinning = use$LIST_AND_DRAWER$Store((s) => s.detailSpinning);
  const detail = use$LIST_AND_DRAWER$Store((s) => s.detail);

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
    callDetailApi(params.query);
  });

  return (
    <Drawer
      title={`샘플(상세#${params.query?.id})`}
      width={800}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      afterOpenChange={afterOpenChange}
      onClose={onCancel}
      extra={
        <Space>
          <Button onClick={handleTest} loading={spinning?.test}>
            TEST
          </Button>
          <Button type='primary' onClick={handleSave} loading={spinning?.save}>
            수정하기
          </Button>
          <Button onClick={handleDelete} loading={spinning?.delete}>
            삭제하기
          </Button>
          <Button onClick={onCancel}>취소</Button>
        </Space>
      }
    >
      TEST {params.query?.id}
      <Descriptions bordered size={"small"}>
        <Descriptions.Item label={t.formItem.example.name.label}>{detail?.name}</Descriptions.Item>
        <Descriptions.Item label={t.formItem.example.birthDt.label}>{detail?.birthDt}</Descriptions.Item>
        <Descriptions.Item label={t.formItem.example.sex.label}>{detail?.sex}</Descriptions.Item>
        <Descriptions.Item label={t.formItem.example.phone1.label}>{detail?.phone1}</Descriptions.Item>
        <Descriptions.Item label={t.formItem.example.phone2.label} span={2}>
          {detail?.phone2}
        </Descriptions.Item>
        <Descriptions.Item label='Status' span={3}>
          <Badge status='processing' text='Running' />
        </Descriptions.Item>
        <Descriptions.Item label={t.formItem.example.hndcapYn.label}>{detail?.hndcapYn}</Descriptions.Item>
        <Descriptions.Item label={t.formItem.example.hndcapGrade.label}>{detail?.hndcapGrade}</Descriptions.Item>
        <Descriptions.Item label={t.formItem.example.hndcapTyp.label}>{detail?.hndcapTyp}</Descriptions.Item>
      </Descriptions>
      <Loading active={detailSpinning} />
    </Drawer>
  );
}

export async function openDetailDrawer(params: ExampleDrawerRequest = {}) {
  const openDrawer = useDrawerStore.getState().openDrawer;
  return await openDrawer<ExampleDrawerResponse>((open, resolve, reject, onClose, afterOpenChange) => (
    <DetailDrawer open={open} onOk={resolve} onCancel={onClose} afterOpenChange={afterOpenChange} params={params} />
  ));
}

export default DetailDrawer;
