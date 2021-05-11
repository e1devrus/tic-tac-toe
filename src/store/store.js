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

export const createStore = ({ state = initialState, reducer }) => ({
  state,
  callbacks: [],
  subscribe(callback) {
    this.callbacks.push(callback);
  },
  notifySubscribers() {
    this.callback.forEach((callback) => callback(this.state));
  },
  dispatch(action) {
    this.state = reducer(this.state, action);
    this.notifySubscribers();
  },
});
