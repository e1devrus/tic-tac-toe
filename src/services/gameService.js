import {
  SET_CELL_VALUE,
  SET_CURRENT_PLAYER, SET_WINNER, START_NEW_GAME,
} from '../store/reducers';
import { CellStateEnum, PlayerEnum } from '../store/store';

export class GameService {
  constructor(store) {
    this.store = store;
    this.store.subscribe((state) => {
      this.state = state;
      if (!state.winner) {
        this.checkForWin();
      }
    });
  }

  startNewGame() {
    this.store.dispatch({
      type: START_NEW_GAME,
    });

    this.store.dispatch({
      type: SET_CURRENT_PLAYER,
      payload: {
        player: PlayerEnum.cross,
      },
    });
  }

  makeMove(x, y, player) {
    if (!this.state.currentPlayer) {
      this.startNewGame();
    }
    if (this.state.gameField[y][x] === CellStateEnum.empty && !this.state.winner) {
      const nextPlayer = player === PlayerEnum.cross ? PlayerEnum.circle : PlayerEnum.cross;
      const value = player === PlayerEnum.cross ? CellStateEnum.cross : CellStateEnum.circle;
      this.store.dispatch({
        type: SET_CELL_VALUE,
        payload: {
          x,
          y,
          value,
        },
      });

      this.store.dispatch({
        type: SET_CURRENT_PLAYER,
        payload: {
          player: nextPlayer,
        },
      });
    }
  }

  checkForWin() {
    // eslint-disable-next-line max-len
    const requiredValue = this.state.currentPlayer === PlayerEnum.cross ? CellStateEnum.circle : CellStateEnum.cross;

    let isCurrentPlayerWinner = false;

    const { gameField } = this.state;

    // проверяем столбцы
    for (let i = 0; i < 3; i++) {
      if (gameField[0][i] === requiredValue
         && gameField[1][i] === requiredValue
         && gameField[2][i] === requiredValue) {
        isCurrentPlayerWinner = true;
      }
    }

    // проверяем строки
    for (let i = 0; i < 3; i++) {
      if (gameField[i][0] === requiredValue
         && gameField[i][1] === requiredValue
         && gameField[i][2] === requiredValue) {
        isCurrentPlayerWinner = true;
      }
    }

    // проверяем диагонали
    if (gameField[0][0] === requiredValue
        && gameField[1][1] === requiredValue
        && gameField[2][2] === requiredValue) {
      isCurrentPlayerWinner = true;
    }
    if (gameField[0][2] === requiredValue
        && gameField[1][1] === requiredValue
        && gameField[2][0] === requiredValue) {
      isCurrentPlayerWinner = true;
    }

    if (isCurrentPlayerWinner) {
      this.store.dispatch({
        type: SET_WINNER,
        payload: {
          winner: this.state.currentPlayer,
        },
      });
    }
  }

  setWinner(player) {
    this.store.dispatch({
      type: SET_WINNER,
      payload: {
        winner: player,
      },
    });
  }
}
