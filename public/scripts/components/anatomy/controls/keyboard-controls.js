export class KeyboardControls {
  constructor(layerManager, interactionModeManager) {
    this.layerManager = layerManager;
    this.interactionModeManager = interactionModeManager;
    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'ArrowRight' || evt.key === 'd' || evt.key === 'D') {
        this.layerManager.nextLayer();
      } else if (evt.key === 'ArrowLeft' || evt.key === 'a' || evt.key === 'A') {
        this.layerManager.previousLayer();
      } else if (evt.key === 'r' || evt.key === 'R') {
        this.layerManager.reset();
      } else if (evt.key === 'h' || evt.key === 'H') {
        if (this.interactionModeManager && this.interactionModeManager.setMode) {
          this.interactionModeManager.setMode('hand-tracking');
        }
      } else if (evt.key === 'c' || evt.key === 'C') {
        if (this.interactionModeManager && this.interactionModeManager.setMode) {
          this.interactionModeManager.setMode('controllers');
        }
      }
    });
  }
}

