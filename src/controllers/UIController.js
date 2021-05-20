import { GameService } from '../services/gameService';
import { CellStateEnum, GameStateEnum, PlayerEnum } from '../store/store';

import circle from '../static/img/circle.png';
import cross from '../static/img/cross.png';

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
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';

    const { fieldLength, fieldWidth, winningLine } = this.state;
    const biggestSide = fieldLength > fieldWidth ? fieldLength : fieldWidth;

    const columnsTemplate = `repeat(${fieldWidth}, calc(30vw / ${biggestSide}))`;
    const rowsTemplate = `repeat(${fieldLength}, calc(30vw / ${biggestSide}))`;

    grid.style.gridTemplateColumns = columnsTemplate;
    grid.style.gridTemplateRows = rowsTemplate;

    const { gameState, gameField, currentPlayer } = this.state;
    const fragment = document.createDocumentFragment();
    gameField.forEach((row, y) => {
      row.forEach((value, x) => {
        const cellElement = document.createElement('div');
        cellElement.className = gameState === GameStateEnum.NOT_STARTED ? 'cell-inactive' : 'cell';

        if (value !== CellStateEnum.empty) {
          cellElement.style.backgroundImage = `url(${value === CellStateEnum.cross ? cross : circle})`;
        } else {
          cellElement.classList.add('cell-empty');
        }

        winningLine.forEach((cell) => {
          if (cell.x === x && cell.y === y) {
            cellElement.classList.add('cell-winning');
          }
        });

        cellElement.addEventListener('click', () => {
          this.gameService.handleCellClick(x, y, currentPlayer);
        });
        fragment.append(cellElement);
      });
    });

    grid.append(fragment);
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

    const grid = document.createElement('div');
    grid.className = 'grid';

    const notification = document.createElement('span');
    notification.className = 'notification';

    const newGameBtn = document.createElement('button');
    newGameBtn.className = 'new-game-btn';
    newGameBtn.textContent = 'Новая игра';
    newGameBtn.addEventListener('click', () => this.gameService.startNewGame());

    container.appendChild(grid);
    container.appendChild(notification);
    container.appendChild(newGameBtn);

    this.gameFieldElement.appendChild(container);
  }
}
