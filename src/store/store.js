export const CellStateEnum = Object.freeze({
  cross: 'cross',
  circle: 'circle',
  empty: 'empty',
});

export const PlayerEnum = Object.freeze({
  cross: 'cross',
  circle: 'circle',
});

export const GameStateEnum = Object.freeze({
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  FINISHED: 'FINISHED',
});

const DEFAULT_FIELD_LENGTH = 15;
const DEFAULT_FIELD_WIDTH = 15;
const DEFAULT_WINNING_LENGTH = 5;

const DEFAULT_FIELD = [];
for (let i = 0; i < DEFAULT_FIELD_LENGTH; i++) {
  DEFAULT_FIELD.push([]);
  for (let j = 0; j < DEFAULT_FIELD_WIDTH; j++) {
    DEFAULT_FIELD[i].push(CellStateEnum.empty);
  }
}

/**
 * gameField: двумерный массив игрового поля, содержащий текущее состояние клеток
 * currentPlayer: кто сейчас ходит - CurrentPlayerEnum | null
 * winner: кто победил - CurrentPlayerEnum | null
 * gameState - текущее состояния игры - GameStateEnum
 * fieldSize - размер игрового поля
 * winningLength - длина ряда, необходимая для победы
 */
const initialState = {
  currentPlayer: null,
  winner: null,
  gameState: GameStateEnum.NOT_STARTED,
  gameField: DEFAULT_FIELD,
  fieldWidth: DEFAULT_FIELD_WIDTH,
  fieldLength: DEFAULT_FIELD_LENGTH,
  winningLength: DEFAULT_WINNING_LENGTH,
};

export const createStore = (reducer) => {
  let state = initialState;

  const callbacks = [];

  const notifySubscribers = () => {
    callbacks.forEach((callback) => callback(state));
  };

  return ({
    dispatch(action) {
      state = reducer(state, action);
      notifySubscribers();
    },
    subscribe(callback) {
      callbacks.push(callback);
      // здесь я сразу вызываю колбэк, т.к. я не придумал лучше способа,
      // как именно провести первый рендер компонента
      callback(state);
    },
    getState() {
      return state;
    },
  });
};
