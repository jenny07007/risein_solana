export const handleError = (error: Error) => {
  console.error(error.message);
  alert(error.message);
};
