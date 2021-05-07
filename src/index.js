import { UIController } from './controllers/UIController';
import './style/style.css';

document.addEventListener('DOMContentLoaded', () => {
  const controller = new UIController();
  controller.init('body');
});
