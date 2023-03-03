import { Rule } from 'antd/lib/form';

export const getInputMaxLengthRule = (
  max: number = 120,
  message: string = 'The maximum length of the field is 120 characters',
): Rule => ({
  max,
  message,
});
