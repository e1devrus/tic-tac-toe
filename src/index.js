import { createStore } from './store/store';
import { gameReducer } from './store/reducers';

import { UIController } from './controllers/UIController';
import './style/style.css';

document.addEventListener('DOMContentLoaded', () => {
  const store = createStore(gameReducer);
  const controller = new UIController(store);
  controller.init('body');
});
