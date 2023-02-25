export const getInitials = (name) => {
  return ('' + name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const generateId = () => {
  return (Math.random().toString(36).substring(2));
};

export const generateNewId = (dataSet) => {
  let id = generateId();

  while (dataSet[id])
    id = generateId();
  return (id);
};

export const formatPhone = (phone) => {
  if (phone?.length !== 10 || !isAValidPhoneNumber(phone))
    return phone;

  return `${phone.slice(0, 2)} ${phone.slice(2, 4)} ${phone.slice(4, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`;
};

export const isAValidPhoneNumber = (phoneNumber) => {
  if (phoneNumber === undefined || phoneNumber === null || phoneNumber === '')
    return false;
  phoneNumber = phoneNumber.replace(/\s/g, '');

  const phoneArray = [...phoneNumber];
  return (phoneArray.every(n => !isNaN(parseInt(n))));
};