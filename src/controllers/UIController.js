export class UIController {
  constructor(store) {
    this.store = store;
  }

  init(selector) {
    this.selector = selector;
    this.gameField = document.querySelector(selector);
    this.render();
  }

  render() {
    this.gameField.innerHTML = `
    <div class="container">
      <div class="grid"> 
        <div class="cell">

        </div>
        <div class="cell">

        </div>
        <div class="cell">

        </div>
        <div class="cell">

        </div>
        <div class="cell">

        </div>
        <div class="cell">

        </div>
        <div class="cell">

        </div>
        <div class="cell">

        </div>
        <div class="cell">

        </div>
      </div>
      <span class="notification">Ходит крестик</span>
      <div class="control-panel">
        <button class="new-game-btn">Новая игра</button>
      </div>
    </div>`;
  }
}
