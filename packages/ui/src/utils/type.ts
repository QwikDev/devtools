export const isListen = (str: string) => {
  return /^on.*\$/.test(str);
};

export const isValue = (value: any) => {
  try {
    return 'untrackedValue' in value && 'value' in value;
  } catch (error) {
    return false;
  }
};
