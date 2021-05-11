export const CellStateEnum = Object.freeze({
  cross: 'cross',
  circle: 'circle',
  empty: 'empty',
});

export const PlayerEnum = Object.freeze({
  cross: 'cross',
  circle: 'circle',
});

/**
 * gameField: двумерный массив игрового поля, содержащий текущее состояние клеток
 * currentPlayer: кто сейчас ходит - CurrentPlayerEnum | null
 * winner: кто победил - CurrentPlayerEnum | null
 */
const initialState = {
  gameField: [
    [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
    [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
    [CellStateEnum.empty, CellStateEnum.empty, CellStateEnum.empty],
  ],
  currentPlayer: null,
  winner: null,
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
      callback(state);
    },
    getState() {
      return state;
    },
  });
};
