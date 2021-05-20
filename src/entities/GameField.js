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

  safelyGetCellByCoords(x, y) {
    if (x < 0 || x >= this.fieldWidth || y < 0 || y > this.fieldLength) {
      return null;
    }
    return this.field[y][x];
  }

  getIncludingLinesForCell(field, cell) {
    const lines = [];

    // получаем вертикальные линии
    for (let y = cell.y - this.winningLength + 1; y <= cell.y + this.winningLength - 1; y++) {
      const line = [];
      for (let i = 0; i < this.winningLength; i++) {
        line.push(this.safelyGetCellByCoords(field, cell.x, y));
      }
      if (line.every((value) => value !== null)) {
        lines.push(line);
      }
    }

    // получаем горизонтальные линии
    for (let x = cell.x - this.winningLength + 1; x <= cell.x + this.winningLength - 1; x++) {
      const line = [];
      for (let i = 0; i < this.winningLength; i++) {
        line.push(this.safelyGetCellByCoords(field, x, cell.y));
      }
      if (line.every((value) => value !== null)) {
        lines.push(line);
      }
    }

    // получаем диагонали
    for (let x = cell.x - this.winningLength + 1, y = cell.y - this.winningLength + 1;
      x <= cell.x + this.winningLength - 1 && y <= cell.y + this.winningLength - 1;
      x++, y++) {
      const line = [];
      for (let i = 0; i < this.winningLength; i++) {
        line.push(this.safelyGetCellByCoords(field, x, y));
      }
      if (line.every((value) => value !== null)) {
        lines.push(line);
      }
    }
    for (let x = cell.x - this.winningLength + 1, y = cell.y + this.winningLength - 1;
      x <= cell.x + this.winningLength - 1 && y <= cell.y - this.winningLength + 1;
      x++, y--) {
      const line = [];
      for (let i = 0; i < this.winningLength; i++) {
        line.push(this.safelyGetCellByCoords(field, x, y));
      }
      if (line.every((value) => value !== null)) {
        lines.push(line);
      }
    }
  }
}
