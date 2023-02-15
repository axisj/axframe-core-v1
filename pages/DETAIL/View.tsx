import * as React from "react";
import { Badge, Descriptions } from "antd";
import styled from "@emotion/styled";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks";
import { use$DETAIL$Store } from "./use$DETAIL$Store";

interface Props {}

function View({}: Props) {
  const { t } = useI18n();
  const detail = use$DETAIL$Store((s) => s.detail);

  return (
    <Body>
      <ContentBoxHeader>{t.pages.example.form.title1}</ContentBoxHeader>
      <ContentBox>
        <Descriptions bordered>
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
          <Descriptions.Item label='Config Info'>
            Data disk type: MongoDB
            <br />
            Database version: 3.4
            <br />
            Package: dds.mongo.mid
            <br />
            Storage space: 10 GB
            <br />
            Replication factor: 3
            <br />
            Region: East China 1
            <br />
          </Descriptions.Item>
        </Descriptions>
      </ContentBox>
    </Body>
  );
}

const Body = styled(PageLayout.Body)``;
const ContentBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const ContentBox = styled(PageLayout.ContentBox)``;

export { View };
