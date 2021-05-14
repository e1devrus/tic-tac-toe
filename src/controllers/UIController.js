import { isEqual } from 'lodash';
import { GameService } from '../services/gameService';
import { CellStateEnum, PlayerEnum } from '../store/store';

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
    const { gameField, currentPlayer, winner } = newState;
    // первая инициализация стейта
    if (!this.state) {
      this.state = newState;
      this.renderGameField(gameField);
      this.renderNotification(currentPlayer, winner);
    } else {
      if (!isEqual(this.state.gameField, gameField)) {
        this.renderGameField(gameField);
      }

      if (this.state.currentPlayer !== currentPlayer
         || this.state.winner !== winner) {
        this.renderNotification(currentPlayer, winner);
      }

      this.state = newState;
    }
  }

  renderGameField(gameField) {
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';

    const fragment = document.createDocumentFragment();
    gameField.forEach((row, y) => {
      row.forEach((value, x) => {
        const cellElement = document.createElement('div');
        cellElement.className = 'cell';
        cellElement.addEventListener('click', () => {
          this.gameService.makeMove(x, y, this.state.currentPlayer);
        });
        if (value !== CellStateEnum.empty) {
          cellElement.textContent = value === CellStateEnum.cross ? 'x' : 'o';
        }
        fragment.append(cellElement);
      });
    });

    grid.append(fragment);
  }

  renderNotification(currentPlayer, winner) {
    const notification = document.querySelector('.notification');

    let notificationText = '';

    if (currentPlayer) {
      notificationText = currentPlayer === PlayerEnum.cross ? 'Ходит крестик' : 'Ходит нолик';
    } else if (winner) {
      notificationText = winner === PlayerEnum.cross ? 'Победил крестик!' : 'Победил нолик!';
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
