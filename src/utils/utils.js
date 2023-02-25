export const isAValidLogin = (login) => {
  if (login === undefined || login === null || login === '')
    return false;
  login = login.replace(/\s/g, '');

  const loginArray = [...login];
  return (loginArray.every(n => typeof n === 'string' && n.match(/^[a-zA-Z0-9]+$/)));
};