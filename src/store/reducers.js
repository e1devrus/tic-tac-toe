import { GameStateEnum, PlayerEnum } from './store';

export const SET_WINNER = 'SET_WINNER';
export const START_NEW_GAME = 'START_NEW_GAME';
export const SET_FIELD = 'SET_FIELD';
export const SET_CURRENT_PLAYER = 'SET_PLAYER';
export const END_GAME = 'END_GAME';
export const SET_WINNING_LINE = 'SET_WINNING_LINE';

export const gameReducer = (state, action) => {
  switch (action.type) {
    case SET_FIELD:
      const {
        newField,
      } = action.payload;

      return {
        ...state,
        gameField: newField,
      };

    case SET_WINNING_LINE:
      const {
        line,
      } = action.payload;

      return {
        ...state,
        winningLine: line,
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
      const {
        field,
      } = action.payload;
      return {
        ...state,
        gameField: field,
        currentPlayer: PlayerEnum.cross,
        winner: null,
        gameState: GameStateEnum.STARTED,
        winningLine: [],
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
