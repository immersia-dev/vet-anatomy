import { ANATOMY_CONSTANTS } from '../config/constants.js';

export class ControllerControls {
  constructor(layerManager) {
    this.layerManager = layerManager;
    this.lastThumbstickAction = { right: 0, left: 0 };
    this.setupControllers();
  }

  setupControllers() {
    const rightController = document.querySelector('#right-hand-controller');
    const leftController = document.querySelector('#left-hand-controller');
    
    if (rightController) {
      rightController.addEventListener('abuttondown', () => {
        this.layerManager.nextLayer();
      });
      rightController.addEventListener('xbuttondown', () => {
        this.layerManager.nextLayer();
      });
      
      rightController.addEventListener('thumbstickmoved', (evt) => {
        const now = Date.now();
        if (now - this.lastThumbstickAction.right < ANATOMY_CONSTANTS.THUMBSTICK_COOLDOWN) {
          return;
        }
        
        if (evt.detail.y > ANATOMY_CONSTANTS.THUMBSTICK_THRESHOLD) {
          this.lastThumbstickAction.right = now;
          this.layerManager.nextLayer();
        }
      });
    }
    
    if (leftController) {
      leftController.addEventListener('bbuttondown', () => {
        this.layerManager.previousLayer();
      });
      leftController.addEventListener('ybuttondown', () => {
        this.layerManager.previousLayer();
      });
      
      leftController.addEventListener('thumbstickmoved', (evt) => {
        const now = Date.now();
        if (now - this.lastThumbstickAction.left < ANATOMY_CONSTANTS.THUMBSTICK_COOLDOWN) {
          return;
        }
        
        if (evt.detail.y > ANATOMY_CONSTANTS.THUMBSTICK_THRESHOLD) {
          this.lastThumbstickAction.left = now;
          this.layerManager.previousLayer();
        }
      });
    }
  }
}

