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

/**
 * gameField: двумерный массив игрового поля, содержащий текущее состояние клеток
 * currentPlayer: кто сейчас ходит - CurrentPlayerEnum | null
 * winner: кто победил - CurrentPlayerEnum | null
 * gameState - текущее состояния игры - GameStateEnum
 */
const initialState = {
  gameField: [
    [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
    [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
    [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
  ],
  currentPlayer: null,
  winner: null,
  gameState: GameStateEnum.NOT_STARTED,
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
