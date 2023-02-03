import * as React from "react";
import { Button, Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Space } from "antd";
import styled from "@emotion/styled";
import { PageLayout } from "styles/pageStyled";
import dayjs from "dayjs";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { useI18n } from "@core/hooks";
import { use$FORM$Store } from "./use$FORM$Store";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { convertToDate } from "@core/utils/object";
import { useDaumPostcodePopup } from "react-daum-postcode";

interface Props {}
interface DtoItem extends ExampleItem {}

function FormSet({}: Props) {
  const saveRequestValue = use$FORM$Store((s) => s.saveRequestValue);
  const setSaveRequestValue = use$FORM$Store((s) => s.setSaveRequestValue);
  const callSaveApi = use$FORM$Store((s) => s.callSaveApi);
  const saveSpinning = use$FORM$Store((s) => s.saveSpinning);
  const reset = use$FORM$Store((s) => s.reset);

  const { t } = useI18n();
  const [form] = Form.useForm();
  const openZipCodeFinder = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const cnsltHow = Form.useWatch("cnsltHow", form);
  const cnsltPath = Form.useWatch("cnsltPath", form);
  const hopePoint = Form.useWatch("hopePoint", form);
  const hopePoint1 = Form.useWatch("hopePoint1", form);
  const hopePoint2 = Form.useWatch("hopePoint2", form);
  const hopePoint3 = Form.useWatch("hopePoint3", form);
  const birthDt = Form.useWatch("birthDt", form);

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
      setSaveRequestValue(values);
    },
    [setSaveRequestValue]
  );

  React.useEffect(() => {
    if (birthDt) {
      const age = dayjs().diff(dayjs(birthDt), "years");
      form.setFieldValue("age", age);
    }
  }, [birthDt, form]);

  React.useEffect(() => {
    if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
      form.resetFields();
    }
  }, [saveRequestValue, form]);

  useDidMountEffect(() => {
    console.log("form.setFieldsValue by metaData");
    form.setFieldsValue(convertToDate(saveRequestValue, ["cnsltDt", "birthDt"]));
  });

  return (
    <Form<DtoItem>
      form={form}
      layout={"vertical"}
      colon={false}
      scrollToFirstError
      initialValues={formInitialValues}
      onValuesChange={onValuesChange}
      onFinish={async () => {
        await callSaveApi();
        await reset();
      }}
    >
      <Body>
        <FormBox>
          <Row gutter={20}>
            <Col xs={24} sm={8}>
              <Form.Item label={t.formItem.counseling.area.label} name={"area"} rules={[{ required: true }]}>
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

        <FormBoxHeader>{t.formItem.counseling.title2}</FormBoxHeader>
        <FormBox>
          <FormGroupTitle>
            <Form.Item name={["hopePoint", "직접지원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{t.formItem.counseling.hopePoint.직접지원}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint1"}>
                <Radio.Group disabled={!hopePoint?.["직접지원"]}>
                  {t.formItem.counseling.hopePoint1.options.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item noStyle name={"hopePoint1Etc"}>
                <Input disabled={hopePoint1 !== "기타" || !hopePoint?.["직접지원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "주거정보자원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{t.formItem.counseling.hopePoint.주거정보자원}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint2"}>
                <Radio.Group disabled={!hopePoint?.["주거정보자원"]}>
                  {t.formItem.counseling.hopePoint2.options.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item noStyle name={"hopePoint2Etc"}>
                <Input disabled={hopePoint2 !== "기타" || !hopePoint?.["주거정보자원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "내부자원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{t.formItem.counseling.hopePoint.내부자원}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint3"}>
                <Radio.Group disabled={!hopePoint?.["내부자원"]}>
                  {t.formItem.counseling.hopePoint3.options.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item noStyle name={"hopePoint3Etc"}>
                <Input disabled={hopePoint3 !== "기타" || !hopePoint?.["내부자원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "기타"]} noStyle valuePropName={"checked"}>
              <Checkbox>{t.formItem.counseling.hopePoint.기타}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <Form.Item name={"hopePoint4Etc"}>
            <Input disabled={!hopePoint?.["기타"]} />
          </Form.Item>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "세부내용"]} noStyle valuePropName={"checked"}>
              <Checkbox> {t.formItem.counseling.hopePoint.세부내용}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <Form.Item name={"hopePoint5Etc"}>
            <Input.TextArea disabled={!hopePoint?.["세부내용"]} showCount maxLength={200} />
          </Form.Item>

          <Form.Item label={t.formItem.counseling.fldT.label} name={"fldT"} rules={[{ required: true }]}>
            <Input.TextArea rows={4} showCount maxLength={200} />
          </Form.Item>
        </FormBox>
        <ButtonGroup>
          <Button type={"primary"} htmlType={"submit"} loading={saveSpinning}>
            저장히기
          </Button>
          <Button onClick={reset}>{t.button.reset}</Button>
        </ButtonGroup>
      </Body>
    </Form>
  );
}

const Body = styled(PageLayout.Body)``;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 960px;
  }
`;
const FormGroupTitle = styled(PageLayout.GroupTitle)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { FormSet };
