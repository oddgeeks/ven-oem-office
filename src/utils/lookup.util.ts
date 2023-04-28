export const lookup = (str = '', o = {}) => {
  return Object.keys(o).find((k) => k.toLowerCase().includes(str.toLowerCase()));
};
