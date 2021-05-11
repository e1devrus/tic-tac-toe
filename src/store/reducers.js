import { cloneDeep } from 'lodash';
import { CellStateEnum, PlayerEnum } from './store';

export const MAKE_MOVE = 'MAKE_MOVE';
export const SET_WINNER = 'SET_WINNER';
export const START_NEW_GAME = 'START_NEW_GAME';

export const gameReducer = (state, action) => {
  switch (action.type) {
    case MAKE_MOVE:
      const {
        x, y, value, nextPlayer,
      } = action.payload;
      const gameField = cloneDeep(state.gameField);
      gameField[y][x] = value;
      return {
        ...state,
        gameField,
        currentPlayer: nextPlayer,
      };

    case SET_WINNER:
      const { winner } = action.payload;
      return {
        ...state,
        winner,
        currentPlayer: null,
      };

    case START_NEW_GAME:
      return {
        ...state,
        gameField: [
          [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
          [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
          [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
        ],
        currentPlayer: PlayerEnum.cross,
        winner: null,
      };
    default:
      return state;
  }
};
