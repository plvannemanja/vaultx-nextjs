export const createCookie = (name: string, value: any) => {
  return localStorage.setItem(name, value);
};

export const getCookie = (name: string) => {
  return localStorage.getItem(name); // => 'value'
};

export const removeCookie = (name: string) => {
  return localStorage.removeItem(name);
};
