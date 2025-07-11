export const isSignal = (value: any) => {
  return value.constructor?.name === 'Signal';
};

export const isStore = (value: any) => {
  return value.constructor?.name === 'Store';
};

export const isComputed = (value: any) => {
  return value.constructor?.name === 'Computed';
};