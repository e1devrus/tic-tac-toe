import { GameService } from '../services/gameService';
import { CellStateEnum, GameStateEnum, PlayerEnum } from '../store/store';

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

    const { gameState, gameField, currentPlayer } = this.state;

    const fragment = document.createDocumentFragment();
    gameField.forEach((row, y) => {
      row.forEach((value, x) => {
        const cellElement = document.createElement('div');
        cellElement.className = gameState === GameStateEnum.NOT_STARTED ? 'cell-inactive' : 'cell';

        if (value !== CellStateEnum.empty) {
          cellElement.textContent = value === CellStateEnum.cross ? 'x' : 'o';
        } else {
          cellElement.classList.add('cell-empty');
        }

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
