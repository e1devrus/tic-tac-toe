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
      return {
        value: null,
      };
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

  isCreatingFork(x, y, value) {
    // 3x3 вилки
    const topPiece = [
      this.safelyGetCellByCoords(x, y - 1),
      this.safelyGetCellByCoords(x, y - 2),
      this.safelyGetCellByCoords(x, y - 3),
    ];
    const topRightPiece = [
      this.safelyGetCellByCoords(x + 1, y - 1),
      this.safelyGetCellByCoords(x + 2, y - 2),
      this.safelyGetCellByCoords(x + 3, y - 3),
    ];
    const rightPiece = [
      this.safelyGetCellByCoords(x + 1, y),
      this.safelyGetCellByCoords(x + 2, y),
      this.safelyGetCellByCoords(x + 3, y),
    ];
    const bottomRightPiece = [
      this.safelyGetCellByCoords(x + 1, y + 1),
      this.safelyGetCellByCoords(x + 2, y + 2),
      this.safelyGetCellByCoords(x + 3, y + 3),
    ];
    const bottomPiece = [
      this.safelyGetCellByCoords(x, y + 1),
      this.safelyGetCellByCoords(x, y + 2),
      this.safelyGetCellByCoords(x, y + 3),
    ];
    const bottomLeftPiece = [
      this.safelyGetCellByCoords(x - 1, y + 1),
      this.safelyGetCellByCoords(x - 2, y + 2),
      this.safelyGetCellByCoords(x - 3, y + 3),
    ];
    const leftPiece = [
      this.safelyGetCellByCoords(x - 1, y),
      this.safelyGetCellByCoords(x - 2, y),
      this.safelyGetCellByCoords(x - 3, y),
    ];
    const topLeftPiece = [
      this.safelyGetCellByCoords(x - 1, y - 1),
      this.safelyGetCellByCoords(x - 2, y - 2),
      this.safelyGetCellByCoords(x - 3, y - 3),
    ];
    const horizontalPiece = [
      this.safelyGetCellByCoords(x - 2, y),
      this.safelyGetCellByCoords(x - 1, y),
      this.safelyGetCellByCoords(x + 1, y),
      this.safelyGetCellByCoords(x + 2, y),
    ];
    const verticalPiece = [
      this.safelyGetCellByCoords(x, y - 2),
      this.safelyGetCellByCoords(x, y - 1),
      this.safelyGetCellByCoords(x, y + 1),
      this.safelyGetCellByCoords(x, y + 2),
    ];

    let potentialForkPieces = [];

    // если "вилку" формируют два противоположных "зубца", то на самом деле
    // это не вилка, просто игрок собрал свои ходы в линию
    // поэтому не добавляем противоположные зубцы,
    // если они одновременно являются подходящими для вилки
    if (!(this.isPossibleForkPiece(topPiece, value)
            && this.isPossibleForkPiece(bottomPiece, value))) {
      potentialForkPieces.push(topPiece);
      potentialForkPieces.push(bottomPiece);
    }
    if (!(this.isPossibleForkPiece(leftPiece, value)
            && this.isPossibleForkPiece(rightPiece, value))) {
      potentialForkPieces.push(leftPiece);
      potentialForkPieces.push(rightPiece);
    }
    if (!(this.isPossibleForkPiece(topLeftPiece, value)
            && this.isPossibleForkPiece(bottomRightPiece, value))) {
      potentialForkPieces.push(topLeftPiece);
      potentialForkPieces.push(bottomRightPiece);
    }
    if (!(this.isPossibleForkPiece(topRightPiece, value)
            && this.isPossibleForkPiece(bottomLeftPiece, value))) {
      potentialForkPieces.push(topRightPiece);
      potentialForkPieces.push(bottomLeftPiece);
    }

    potentialForkPieces = potentialForkPieces
      .filter((piece) => this.isPossibleForkPiece(piece, value));

    [horizontalPiece, verticalPiece].forEach((piece) => {
      if (piece[0].value !== value
        && piece[1].value === value
        && piece[2].value === value
        && piece[3].value !== value) {
        potentialForkPieces.push(piece);
      }
    });

    return potentialForkPieces.length > 1;
  }

  isPossibleForkPiece(piece, value) {
    return piece[piece.length - 1] !== value
        && piece.slice(0, -1).every((cell) => cell.value === value);
  }
}
