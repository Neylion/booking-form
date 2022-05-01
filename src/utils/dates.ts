export const dateStringHasValidFormat = (inputValue: string) => {
  const inputDate = new Date(inputValue);
  if (!inputDate.getTime()) return false;

  const dateSplit = inputValue.split('-');
  const hasCorrectFormat = dateSplit[0]?.length === 4 && dateSplit[1]?.length === 2 && dateSplit[2]?.length === 2;
  return hasCorrectFormat;
};
