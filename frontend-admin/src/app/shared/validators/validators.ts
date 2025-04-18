export const emailAsyncValidator = (control: any) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailPattern.test(control.value);
  return Promise.resolve(isValid ? null : { invalidEmail: true });
}
