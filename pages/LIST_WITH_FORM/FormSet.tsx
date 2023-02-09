import * as React from "react";
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, Space } from "antd";
import styled from "@emotion/styled";
import { PageLayout } from "styles/pageStyled";
import dayjs from "dayjs";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { useI18n } from "@core/hooks";
import { convertToDate } from "@core/utils/object";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { use$LIST_WITH_FORM$Store } from "./use$LIST_WITH_FORM$Store";
import { EmptyMsg } from "@core/components/common";

interface Props {}
interface DtoItem extends ExampleItem {}

function FormSet({}: Props) {
  const saveRequestValue = use$LIST_WITH_FORM$Store((s) => s.saveRequestValue);
  const setSaveRequestValue = use$LIST_WITH_FORM$Store((s) => s.setSaveRequestValue);
  const callSaveApi = use$LIST_WITH_FORM$Store((s) => s.callSaveApi);
  const saveSpinning = use$LIST_WITH_FORM$Store((s) => s.saveSpinning);
  const flexGrow = use$LIST_WITH_FORM$Store((s) => s.flexGrow);
  const listSelectedRowKey = use$LIST_WITH_FORM$Store((s) => s.listSelectedRowKey);
  const formActive = use$LIST_WITH_FORM$Store((s) => s.formActive);
  const cancelFormActive = use$LIST_WITH_FORM$Store((s) => s.cancelFormActive);
  const setFormActive = use$LIST_WITH_FORM$Store((s) => s.setFormActive);

  const { t } = useI18n();
  const [form] = Form.useForm();
  const openZipCodeFinder = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const cnsltHow = Form.useWatch("cnsltHow", form);
  const cnsltPath = Form.useWatch("cnsltPath", form);

  const formInitialValues = {}; // form 의 초기값 reset해도 이값 으로 리셋됨

  const handleFindZipCode = React.useCallback(async () => {
    await openZipCodeFinder({
      onComplete: (data) => {
        form.setFieldsValue({
          zipNum: data.zonecode,
          addr: data.address,
        });
        form.getFieldInstance("addrDtls").focus();
      },
    });
  }, [form, openZipCodeFinder]);

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      if ("birthDt" in changedValues) {
        values["age"] = dayjs().diff(dayjs(changedValues.birthDt), "years");
      }
      setSaveRequestValue(values);
    },
    [setSaveRequestValue]
  );

  React.useEffect(() => {
    if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
      form.resetFields();
    } else {
      form.setFieldsValue(convertToDate(saveRequestValue, ["cnsltDt", "birthDt"]));
    }
  }, [saveRequestValue, form]);

  if (!formActive && !listSelectedRowKey) {
    return (
      <Frame style={{ flex: 2 - flexGrow }}>
        <EmptyMsg>
          <Button
            type={"ghost"}
            size='small'
            onClick={() => {
              cancelFormActive();
              setFormActive();
            }}
          >
            {t.button.addNew}
          </Button>
        </EmptyMsg>
        <Form form={form} />
      </Frame>
    );
  }

  return (
    <Frame style={{ flex: 2 - flexGrow }}>
      <Header>Form</Header>
      <Body>
        <Form<DtoItem>
          form={form}
          layout={"vertical"}
          colon={false}
          scrollToFirstError
          initialValues={formInitialValues}
          onValuesChange={onValuesChange}
          onFinish={async () => {
            await callSaveApi();
            await cancelFormActive();
          }}
        >
          <FormBox>
            <Row gutter={20}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label={t.formItem.counseling.area.label}
                  name={"area"}
                  rules={[{ required: true, message: "커스텀 메세지 사용 가능" }]}
                >
                  <Select options={t.formItem.counseling.area.options} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label={t.formItem.counseling.cnsltUserCd.label}
                  name={"cnsltUserCd"}
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value={"system"}>시스템관리자</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={t.formItem.counseling.cnsltDt.label} name={"cnsltDt"}>
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t.formItem.counseling.cnsltHow.label} rules={[{ required: true }]}>
              <Space size={[8, 16]} wrap>
                <Form.Item noStyle name={"cnsltHow"}>
                  <Radio.Group>
                    {t.formItem.counseling.cnsltHow.options.map((o, i) => (
                      <Radio value={o.value} key={i}>
                        {o.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
                <Form.Item noStyle name={"cnsltHowEtc"}>
                  <Input disabled={cnsltHow !== "기타"} />
                </Form.Item>
              </Space>
            </Form.Item>

            <Form.Item
              label={t.formItem.counseling.cnsltPath.label}
              required
              name={"cnsltPath"}
              style={{ marginBottom: 5 }}
            >
              <Radio.Group>
                {t.formItem.counseling.cnsltPath.options.map((o, i) => (
                  <Radio value={o.value} key={i}>
                    {o.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            {cnsltPath === "관련기관" && (
              <Form.Item noStyle name={"cnsltPathDtl"}>
                <Radio.Group>
                  {t.formItem.counseling.cnsltPathDtl.options.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            )}
            {cnsltPath === "개인소개" && (
              <Form.Item noStyle name={"cnsltPathPerson"}>
                <Input placeholder={t.formItem.counseling.cnsltPathPerson.placeholder} style={{ maxWidth: 300 }} />
              </Form.Item>
            )}
            {cnsltPath === "본인직접" && (
              <Form.Item noStyle name={"cnsltPathDirect"}>
                <Input placeholder={t.formItem.counseling.cnsltPathDirect.placeholder} style={{ maxWidth: 300 }} />
              </Form.Item>
            )}
            {cnsltPath === "기타기관" && (
              <Space size={20} wrap>
                <Form.Item noStyle name={"cnsltPathOrg"}>
                  <Input placeholder={t.formItem.counseling.cnsltPathOrg.placeholder} />
                </Form.Item>
                <Form.Item noStyle name={"cnsltPathOrgPerson"}>
                  <Input placeholder={t.formItem.counseling.cnsltPathOrgPerson.placeholder} />
                </Form.Item>
                <Form.Item noStyle name={"cnsltPathOrgPhone"}>
                  <Input placeholder={t.formItem.counseling.cnsltPathOrgPhone.placeholder} />
                </Form.Item>
              </Space>
            )}
          </FormBox>

          <FormBoxHeader>{t.formItem.counseling.title1}</FormBoxHeader>
          <FormBox>
            <Row gutter={20}>
              <Col xs={24} sm={8}>
                <Form.Item label={t.formItem.counseling.name.label} name={"name"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={t.formItem.counseling.birthDt.label}>
                  <Input.Group compact>
                    <Form.Item name={"birthDt"} noStyle rules={[{ required: true }]}>
                      <DatePicker picker={"date"} />
                    </Form.Item>
                    <Form.Item name={"age"} noStyle>
                      <Input
                        readOnly
                        style={{ width: 80 }}
                        prefix={t.formItem.counseling.age.prefix}
                        suffix={t.formItem.counseling.age.suffix}
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={t.formItem.counseling.sex.label} name={"sex"}>
                  <Radio.Group>
                    {t.formItem.counseling.sex.options.map((o, i) => (
                      <Radio value={o.value} key={i}>
                        {o.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} sm={8}>
                <Form.Item label={t.formItem.counseling.phone1.label} name={"phone1"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={t.formItem.counseling.phone2.label} name={"phone2"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} sm={8}>
                <Form.Item label={t.formItem.counseling.hndcapYn.label} name={"hndcapYn"} rules={[{ required: true }]}>
                  <Radio.Group>
                    {t.formItem.counseling.hndcapYn.options.map((o, i) => (
                      <Radio value={o.value} key={i}>
                        {o.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={16}>
                <Form.Item
                  label={t.formItem.counseling.hndcapGrade.label}
                  name={"hndcapGrade"}
                  rules={[{ required: true }]}
                >
                  <Radio.Group>
                    {t.formItem.counseling.hndcapGrade.options.map((o, i) => (
                      <Radio value={o.value} key={i}>
                        {o.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t.formItem.counseling.hndcapTyp.label} name={"hndcapTyp"} rules={[{ required: true }]}>
              <Radio.Group>
                {t.formItem.counseling.hndcapTyp.options.map((o, i) => (
                  <Radio value={o.value} key={i}>
                    {o.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item label={t.formItem.counseling.addr.label}>
              <Row gutter={[10, 10]}>
                <Col xs={12} sm={3}>
                  <Form.Item noStyle name={"zipNum"}>
                    <Input readOnly />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={3}>
                  <Button block onClick={handleFindZipCode}>
                    {t.button.findAddr}
                  </Button>
                </Col>
                <Col xs={24} sm={9}>
                  <Form.Item noStyle name={"addr"}>
                    <Input readOnly />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={9}>
                  <Form.Item noStyle name={"addrDtls"}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </FormBox>
          <ButtonGroup>
            <Button type={"primary"} htmlType={"submit"} loading={saveSpinning}>
              저장하기
            </Button>
            <Button onClick={() => cancelFormActive()}>{t.button.cancel}</Button>
          </ButtonGroup>
        </Form>
      </Body>
    </Frame>
  );
}

const Frame = styled(PageLayout.FrameColumn)`
  padding: 0 30px 30px 15px;
`;
const Header = styled(PageLayout.FrameHeader)``;
const Body = styled.div``;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 960px;
  }
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { FormSet };
