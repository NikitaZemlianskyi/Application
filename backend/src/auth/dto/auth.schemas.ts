import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  name: yup.string().required(),
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export type RegisterDto = yup.InferType<typeof registerSchema>;
export type LoginDto = yup.InferType<typeof loginSchema>;
