import * as React from "react";
import { Button, Col, DatePicker, Form, FormInstance, Input, Row, Select } from "antd";
import styled from "@emotion/styled";
import { PageLayout } from "styles/pageStyled";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { useI18n } from "@core/hooks";
import { use$LIST_WITH_FORM_LIST$Store } from "./use$LIST_WITH_FORM_LIST$Store";
import { EmptyMsg } from "components/common";
import { convertToDate } from "@core/utils/object";
import { SubListDataGrid } from "./SubListDataGrid";
import { errorDialog } from "@core/components/dialogs";

interface Props {
  form: FormInstance<DtoItem>;
}
interface DtoItem extends ExampleItem {}

function FormSet({ form }: Props) {
  const saveRequestValue = use$LIST_WITH_FORM_LIST$Store((s) => s.saveRequestValue);
  const setSaveRequestValue = use$LIST_WITH_FORM_LIST$Store((s) => s.setSaveRequestValue);
  const callSaveApi = use$LIST_WITH_FORM_LIST$Store((s) => s.callSaveApi);
  const listSelectedRowKey = use$LIST_WITH_FORM_LIST$Store((s) => s.listSelectedRowKey);
  const formActive = use$LIST_WITH_FORM_LIST$Store((s) => s.formActive);
  const cancelFormActive = use$LIST_WITH_FORM_LIST$Store((s) => s.cancelFormActive);
  const setFormActive = use$LIST_WITH_FORM_LIST$Store((s) => s.setFormActive);
  const { t } = useI18n();

  const formInitialValues = React.useRef({}).current; // form 의 초기값 reset해도 이값 으로 리셋됨

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      setSaveRequestValue(values);
    },
    [setSaveRequestValue]
  );

  React.useEffect(() => {
    try {
      if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
        form.resetFields();
      } else {
        form.setFieldsValue(convertToDate({ ...formInitialValues, ...saveRequestValue }, ["cnsltDt"]));
      }
    } catch (err) {
      errorDialog(err as any);
    }
  }, [saveRequestValue, form, formInitialValues]);

  if (!formActive && !listSelectedRowKey) {
    return (
      <>
        <EmptyMsg>
          <Button
            onClick={() => {
              cancelFormActive();
              setFormActive();
            }}
          >
            {t.button.addNew}
          </Button>
        </EmptyMsg>
        <Form form={form} />
      </>
    );
  }

  return (
    <>
      <Header>
        {t.pages.example.form.title2}
        <ButtonGroup compact>
          <Button onClick={() => cancelFormActive()}>{t.button.cancel}</Button>
        </ButtonGroup>
      </Header>
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
            <Row gutter={[20, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item label={"ID"} name={"id"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label={t.pages.example.form.area.label}
                  name={"area"}
                  rules={[{ required: true, message: "커스텀 메세지 사용 가능" }]}
                >
                  <Select options={t.pages.example.form.area.options} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item label={t.pages.example.form.cnsltDt.label} name={"cnsltDt"}>
                  <DatePicker placeholder={t.pages.example.form.selectDate.placeholder} />
                </Form.Item>
              </Col>
            </Row>
          </FormBox>

          <SubListDataGrid />
        </Form>
      </Body>
    </>
  );
}

const Header = styled(PageLayout.FrameHeader)``;
const Body = styled.div``;

const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 960px;
  }
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { FormSet };
