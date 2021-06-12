/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import { GameService } from '../services/gameService';
import { CellStateEnum, GameStateEnum, PlayerEnum } from '../store/store';

const MARGINS = 10;
const CELL_SIZE = 30;

const STYLE = {
  FIELD_UNACTIVE_BG: 'rgba(191,204,214, 0.3)',
  FIELD_ACTIVE_BG: '#fff',
  STROKE: '#1e303e',
  CELL_EMPTY_BG: '#fff',
  CELL_HOVER_BG: '#c2c9cf',
  CELL_WINNING_BG: '#3fe059',
};

export class UIController {
  constructor(store) {
    this.store = store;
    this.gameService = new GameService(store);
  }

  init(selector) {
    this.selector = selector;
    this.gameFieldElement = document.querySelector(selector);
    this.renderGameTemplate();
    this.store.subscribe(this.handleStateChange.bind(this));
  }

  handleStateChange(newState) {
    this.state = newState;
    this.renderGameField();
    this.renderNotification();
  }

  renderGameField() {
    const {
      gameState, currentPlayer, fieldLength, fieldWidth,
    } = this.state;

    switch (gameState) {
      case GameStateEnum.NOT_STARTED:
        this.renderFieldWrapper();
        break;
      case GameStateEnum.STARTED:
        this.generateCanvasCells();

        this.renderCells();

        this.canvas.onmousemove = (event) => {
          this.renderCells(event);
        };

        this.canvas.onclick = (event) => {
          const rect = this.canvas.getBoundingClientRect();
          const eventX = event.clientX - rect.left;
          const eventY = event.clientY - rect.top;
          outer: for (let i = 0; i < fieldLength; i++) {
            for (let j = 0; j < fieldWidth; j++) {
              const cell = this.canvasCells[i][j];
              if (this.isPointInCell({ x: eventX, y: eventY }, cell)) {
                this.gameService.handleCellClick(cell.x, cell.y, currentPlayer);
                break outer;
              }
            }
          }
        };
        break;
      default: break;
    }
  }

  generateCanvasCells() {
    const {
      fieldWidth, fieldLength, gameField,
    } = this.state;
    this.canvasCells = [];
    for (let i = 0; i < fieldLength; i++) {
      this.canvasCells.push([]);
      for (let j = 0; j < fieldWidth; j++) {
        const xStart = MARGINS + (MARGINS + CELL_SIZE) * i;
        const yStart = MARGINS + (MARGINS + CELL_SIZE) * j;
        this.canvasCells[i].push({
          x: j,
          y: i,
          xStart,
          yStart,
          xEnd: xStart + CELL_SIZE,
          yEnd: yStart + CELL_SIZE,
          value: gameField[i][j],
        });
      }
    }
  }

  renderFieldWrapper() {
    const {
      gameState, fieldWidth, fieldLength,
    } = this.state;

    const canvasWidth = fieldWidth * CELL_SIZE + (fieldWidth + 1) * MARGINS;
    const canvasLength = fieldLength * CELL_SIZE + (fieldLength + 1) * MARGINS;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasLength;

    this.ctx.strokeStyle = STYLE.STROKE;
    switch (gameState) {
      case GameStateEnum.NOT_STARTED:
        this.ctx.fillStyle = STYLE.FIELD_UNACTIVE_BG;
        break;
      default:
        this.ctx.fillStyle = STYLE.FIELD_ACTIVE_BG;
        break;
    }
    this.ctx.fillRect(0, 0, canvasWidth, canvasLength);
    this.ctx.strokeRect(0, 0, canvasWidth, canvasLength);
  }

  renderCells(mouseMoveEvent) {
    this.canvasCells.forEach((row) => {
      row.forEach((cell) => {
        this.renderCell(cell, mouseMoveEvent);
      });
    });
  }

  renderCell(cell, mouseMoveEvent) {
    const { winningLine } = this.state;
    const {
      x, y, xStart, yStart, value,
    } = cell;

    if (winningLine.some((winningLineCell) => winningLineCell.x === x && winningLineCell.y === y)) {
      this.ctx.fillStyle = STYLE.CELL_WINNING_BG;
    } else {
      let isCellHovered = false;
      if (mouseMoveEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const eventX = mouseMoveEvent.clientX - rect.left;
        const eventY = mouseMoveEvent.clientY - rect.top;
        if (this.isPointInCell({ x: eventX, y: eventY }, cell)) {
          isCellHovered = true;
        }
      }
      this.ctx.fillStyle = isCellHovered ? STYLE.CELL_HOVER_BG : STYLE.CELL_EMPTY_BG;
    }

    this.ctx.fillRect(xStart, yStart, CELL_SIZE, CELL_SIZE);
    this.ctx.strokeRect(xStart, yStart, CELL_SIZE, CELL_SIZE);

    switch (value) {
      case CellStateEnum.circle:
        this.ctx.beginPath();
        this.ctx.arc(xStart + CELL_SIZE / 2, yStart + CELL_SIZE / 2, CELL_SIZE / 3, 0, 360);
        this.ctx.stroke();
        this.ctx.closePath();
        break;

      case CellStateEnum.cross:
        this.ctx.beginPath();

        this.ctx.moveTo(xStart + 5, yStart + 5);
        this.ctx.lineTo(xStart + CELL_SIZE - 5, yStart + CELL_SIZE - 5);
        this.ctx.stroke();

        this.ctx.moveTo(xStart + 5, yStart + CELL_SIZE - 5);
        this.ctx.lineTo(xStart + CELL_SIZE - 5, yStart + 5);
        this.ctx.stroke();
        this.ctx.closePath();
        break;

      default: break;
    }
  }

  renderNotification() {
    const { currentPlayer, winner } = this.state;

    const notification = document.querySelector('.notification');

    let notificationText = '';

    switch (this.state.gameState) {
      case GameStateEnum.STARTED:
        notificationText = currentPlayer === PlayerEnum.cross ? 'Ходит крестик' : 'Ходит нолик';
        break;
      case GameStateEnum.FINISHED:
        if (!winner) {
          notificationText = 'Победила дружба!';
        } else {
          notificationText = winner === PlayerEnum.cross ? 'Победил крестик!' : 'Победил нолик!';
        }
        break;
      default:
        break;
    }

    notification.textContent = notificationText;
  }

  renderGameTemplate() {
    const container = document.createElement('div');
    container.className = 'container';

    const canvas = document.createElement('canvas');
    canvas.className = 'canvas';
    const ctx = canvas.getContext('2d');

    this.canvas = canvas;
    this.ctx = ctx;

    const notification = document.createElement('span');
    notification.className = 'notification';

    const newGameBtn = document.createElement('button');
    newGameBtn.className = 'new-game-btn';
    newGameBtn.textContent = 'Новая игра';
    newGameBtn.addEventListener('click', () => this.gameService.startNewGame());

    container.appendChild(canvas);
    container.appendChild(notification);
    container.appendChild(newGameBtn);

    this.gameFieldElement.appendChild(container);
  }

  isPointInCell(point, cell) {
    const {
      x, y,
    } = point;
    const {
      xStart,
      yStart,
      xEnd,
      yEnd,
    } = cell;
    return xStart <= x && x <= xEnd && yStart <= y && y <= yEnd;
  }
}
