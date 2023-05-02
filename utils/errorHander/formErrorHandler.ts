import { FormInstance, message } from "antd";

export async function formErrorHandler(form: FormInstance) {
  const errors = form.getFieldsError().filter((info) => info.errors.length);
  if (errors && errors[0] && errors[0].name) {
    const fieldNames = errors[0].name;
    form.scrollToField(fieldNames);
    await message.error(`${errors[0].errors}`);
    // await alertDialog({ content: `${errors[0].errors}` });
  }
}
