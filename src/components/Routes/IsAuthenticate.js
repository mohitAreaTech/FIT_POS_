import cookie from 'react-cookies'
export const isAuthenticated = () => {
  if (cookie.load('postoken')) {
    return true
  } else {
    return false;
  }
};