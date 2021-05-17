export const generateFieldTemplate = (width, length, defaultCellValue) => {
  const field = [];

  for (let i = 0; i < length; i++) {
    field.push([]);
    for (let j = 0; j < width; j++) {
      field[i].push(defaultCellValue);
    }
  }

  return field;
};
