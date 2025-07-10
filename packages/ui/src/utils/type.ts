export const detectBasicType = (value: any) => {
  if (typeof value === 'object' && value !== null) {
    return 'object';
  }
  return typeof value;
};