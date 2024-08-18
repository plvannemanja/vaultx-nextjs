export const createCookie = (name: string, value: any) => {
  if (typeof window !== 'undefined') {
    return localStorage.setItem(name, value);
  } else {
    return null;
  }
};

export const getCookie = (name: string) => {
  // return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjA2ODlmOGM3ZTZiMTM5NmZkOWJjMDkiLCJ3YWxsZXQiOiIweDcwOTk3OTcwQzUxODEyZGMzQTAxMEM3ZDAxYjUwZTBkMTdkYzc5QzgiLCJpYXQiOjE3MjI3Nzk5NjcsImV4cCI6MTcyMjg2NjM2N30.1M9nZJEPm9co0lBcXE5IeA-Yw6apu9Gvk8QgJo7wKzc';
  if (typeof window !== 'undefined') {
    return localStorage.getItem(name); // => 'value'
  } else {
    return null;
  }
};

export const removeCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.removeItem(name);
  } else {
    return null;
  }
};
