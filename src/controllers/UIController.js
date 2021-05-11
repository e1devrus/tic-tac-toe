import { isEqual } from 'lodash';
import { START_NEW_GAME } from '../store/reducers';
import { PlayerEnum } from '../store/store';

export class UIController {
  constructor(store) {
    this.store = store;
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
    if (!this.currentState) {
      this.currentState = newState;
      this.renderGameField(gameField);
      this.renderNotification(currentPlayer, winner);
    } else {
      if (!isEqual(this.currentState.gameField, gameField)) {
        this.renderGameField(gameField);
      }

      if (this.currentState.currentPlayer !== currentPlayer
         || this.currentState.winner !== winner) {
        this.renderNotification(currentPlayer, winner);
      }

      this.currentState = newState;
    }
  }

  renderGameField(gameField) {
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';

    const fragment = document.createDocumentFragment();
    gameField.forEach((row, rowIndex) => {
      row.forEach((value, cellIndex) => {
        const cellElement = document.createElement('div');
        cellElement.setAttribute('x', cellIndex);
        cellElement.setAttribute('y', rowIndex);
        cellElement.setAttribute('value', value);
        cellElement.className = 'cell';
        fragment.append(cellElement);
      });
    });

    grid.append(fragment);
  }

  renderNotification(currentPlayer, winner) {
    const notification = document.quesrySelectoe('.notification');

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
    newGameBtn.addEventListener('click', () => this.store.dispatch({
      type: START_NEW_GAME,
    }));

    container.appendChild(grid);
    container.appendChild(notification);
    container.appendChild(newGameBtn);

    this.gameFieldElement.appendChild(container);
  }
}
