import { cloneDeep } from 'lodash';
import { CellStateEnum, GameStateEnum, PlayerEnum } from './store';

export const SET_WINNER = 'SET_WINNER';
export const START_NEW_GAME = 'START_NEW_GAME';
export const SET_CELL_VALUE = 'SET_CELL_VALUE';
export const SET_CURRENT_PLAYER = 'SET_PLAYER';
export const END_GAME = 'END_GAME';

export const gameReducer = (state, action) => {
  switch (action.type) {
    case SET_CELL_VALUE:
      const {
        x, y, value,
      } = action.payload;
      const gameField = cloneDeep(state.gameField);
      gameField[y][x] = value;

      return {
        ...state,
        gameField,
      };
    case SET_CURRENT_PLAYER:
      const {
        player,
      } = action.payload;

      return {
        ...state,
        currentPlayer: player,
      };

    case SET_WINNER:
      const { winner } = action.payload;

      return {
        ...state,
        winner,
        currentPlayer: null,
        gameState: GameStateEnum.FINISHED,
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
        gameState: GameStateEnum.STARTED,
      };
    case END_GAME:
      return {
        ...state,
        gameState: GameStateEnum.FINISHED,
      };
    default:
      return state;
  }
};
