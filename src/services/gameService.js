import { GameField } from '../entities/GameField';
import {
  END_GAME,
  SET_CURRENT_PLAYER,
  SET_FIELD,
  SET_WINNER,
  SET_WINNING_LINE,
  START_NEW_GAME,
} from '../store/reducers';
import {
  CellStateEnum, GameStateEnum, PlayerEnum,
} from '../store/store';

export class GameService {
  constructor(store) {
    this.store = store;
    this.store.subscribe((state) => {
      this.state = state;
    });
  }

  startNewGame() {
    const {
      fieldWidth, fieldLength, winningLength,
    } = this.state;
    this.gameField = new GameField(fieldWidth, fieldLength, winningLength, CellStateEnum.empty);
    this.store.dispatch({
      type: START_NEW_GAME,
      payload: {
        field: this.gameField.getField(),
      },
    });
  }

  handleCellClick(x, y, player) {
    const { gameState, gameField } = this.state;
    if (gameState === GameStateEnum.STARTED
        && gameField[y][x] === CellStateEnum.empty) {
      const nextPlayer = player === PlayerEnum.cross ? PlayerEnum.circle : PlayerEnum.cross;
      const value = player === PlayerEnum.cross ? CellStateEnum.cross : CellStateEnum.circle;

      const isCreatingFork = player === PlayerEnum.cross
        ? this.gameField.isCreatingFork(x, y, value)
        : false;

      if (!isCreatingFork) {
        const newField = this.gameField.setCellValue(x, y, value);

        this.store.dispatch({
          type: SET_FIELD,
          payload: {
            newField,
          },
        });

        this.checkForWinner(x, y, value);

        this.store.dispatch({
          type: SET_CURRENT_PLAYER,
          payload: {
            player: nextPlayer,
          },
        });
      } else {
        alert('Вилки 3 на 3 запрещены!');
      }
    }
  }

  checkForWinner(x, y, value) {
    // eslint-disable-next-line max-len
    const lines = this.gameField.getIncludingLinesForCell({
      x,
      y,
    });

    let isCurrentPlayerWinner = false;
    let winningLine = [];

    lines.forEach((line) => {
      if (line.every((cell) => cell.value === value)) {
        winningLine = line;
        isCurrentPlayerWinner = true;
      }
    });

    if (isCurrentPlayerWinner) {
      this.store.dispatch({
        type: SET_WINNER,
        payload: {
          winner: this.state.currentPlayer,
        },
      });

      this.store.dispatch({
        type: SET_WINNING_LINE,
        payload: {
          line: winningLine,
        },
      });

      this.store.dispatch({
        type: END_GAME,
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
