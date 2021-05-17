import { flatten } from 'lodash';
import {
  END_GAME,
  SET_CELL_VALUE,
  SET_CURRENT_PLAYER, SET_WINNER, START_NEW_GAME,
} from '../store/reducers';
import { CellStateEnum, GameStateEnum, PlayerEnum } from '../store/store';

export class GameService {
  constructor(store) {
    this.store = store;
    this.store.subscribe((state) => {
      this.state = state;
      if (state.gameState !== GameStateEnum.FINISHED) {
        this.processGamePosition();
      }
    });
  }

  startNewGame() {
    const {
      fieldWidth, fieldLength,
    } = this.state;
    this.store.dispatch({
      type: START_NEW_GAME,
      payload: {
        width: fieldWidth,
        length: fieldLength,
      },
    });
  }

  handleCellClick(x, y, player) {
    if (this.state.gameState === GameStateEnum.STARTED
        && this.state.gameField[y][x] === CellStateEnum.empty) {
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

  processGamePosition() {
    this.checkForWinner();
    if (!this.state.winner) {
      const isGameFieldFull = flatten(this.state.gameField)
        .every((cellValue) => cellValue !== CellStateEnum.empty);
      if (isGameFieldFull) {
        this.store.dispatch({
          type: END_GAME,
        });
      }
    }
  }

  checkForWinner() {
    // eslint-disable-next-line max-len
    // const requiredValue = this.state.currentPlayer === PlayerEnum.cross ? CellStateEnum.cross : CellStateEnum.circle;

    const isCurrentPlayerWinner = false;

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
