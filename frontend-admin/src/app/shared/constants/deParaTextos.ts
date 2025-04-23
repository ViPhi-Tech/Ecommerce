export const translate = (text: any) => {
  const texts: any = {
    'Invalid email or password': 'E-mail ou senha inválidos',
  }

  return texts[text] ? texts[text] : text;
}
