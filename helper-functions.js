export const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate();
  let month = date.getMonth() + 1;
  if (month < 10) month = 0 + "" + month;
  const year = date.getFullYear();

  return day + "" + month + "" + year;
};
