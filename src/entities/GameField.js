export class GameField {
  constructor(width, length, winningLength, defaultValue) {
    this.field = [];
    this.fieldWidth = width;
    this.fieldLength = length;
    this.winningLength = winningLength;

    for (let i = 0; i < length; i++) {
      this.field.push([]);
      for (let j = 0; j < width; j++) {
        this.field[i].push(defaultValue);
      }
    }
  }

  getField() {
    return this.field;
  }

  setCellValue(x, y, value) {
    this.field[y][x] = value;

    return this.field;
  }

  safelyGetCellByCoords(x, y) {
    if (x < 0 || x >= this.fieldWidth || y < 0 || y >= this.fieldLength) {
      return null;
    }
    return {
      x,
      y,
      value: this.field[y][x],
    };
  }

  getIncludingLinesForCell(cell) {
    const lines = [];
    // получаем вертикальные линии
    for (let yStart = cell.y - this.winningLength + 1; yStart <= cell.y; yStart++) {
      const line = [];
      for (let i = 0; i < this.winningLength; i++) {
        line.push(this.safelyGetCellByCoords(cell.x, yStart + i));
      }
      if (line.every((lineCell) => lineCell !== null)) {
        lines.push(line);
      }
    }

    // получаем горизонтальные линии
    for (let xStart = cell.x - this.winningLength + 1; xStart <= cell.x; xStart++) {
      const line = [];
      for (let i = 0; i < this.winningLength; i++) {
        line.push(this.safelyGetCellByCoords(xStart + i, cell.y));
      }
      if (line.every((lineCell) => lineCell !== null)) {
        lines.push(line);
      }
    }

    // получаем диагонали
    for (let xStart = cell.x - this.winningLength + 1, yStart = cell.y - this.winningLength + 1;
      xStart <= cell.x && yStart <= cell.y;
      xStart++, yStart++) {
      const line = [];
      for (let i = 0; i < this.winningLength; i++) {
        line.push(this.safelyGetCellByCoords(xStart + i, yStart + i));
      }
      if (line.every((lineCell) => lineCell !== null)) {
        lines.push(line);
      }
    }
    for (let xStart = cell.x - this.winningLength + 1, yStart = cell.y + this.winningLength - 1;
      xStart <= cell.x && yStart >= cell.y;
      xStart++, yStart--) {
      const line = [];
      for (let i = 0; i < this.winningLength; i++) {
        line.push(this.safelyGetCellByCoords(xStart + i, yStart - i));
      }
      if (line.every((lineCell) => lineCell !== null)) {
        lines.push(line);
      }
    }
    return lines;
  }
}
