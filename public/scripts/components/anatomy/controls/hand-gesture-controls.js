import { ANATOMY_CONSTANTS } from '../config/constants.js';

export class HandGestureControls {
  constructor(layerManager) {
    this.layerManager = layerManager;
    this.lastGestureTime = { left: 0, right: 0 };
    this.modelsContainerPos = new THREE.Vector3();
    this.setupGestures();
  }

  setupGestures() {
    const rightHand = document.querySelector('#right-hand-tracking');
    const leftHand = document.querySelector('#left-hand-tracking');
    const modelsContainer = document.querySelector('#anatomy-models-container');
    
    if (rightHand) {
      rightHand.addEventListener('pinchstarted', (evt) => {
        const now = Date.now();
        if (now - this.lastGestureTime.right < ANATOMY_CONSTANTS.GESTURE_COOLDOWN) {
          return;
        }
        
        const rightHandPos = new THREE.Vector3();
        rightHand.object3D.getWorldPosition(rightHandPos);
        
        if (modelsContainer) {
          modelsContainer.object3D.getWorldPosition(this.modelsContainerPos);
          const distance = rightHandPos.distanceTo(this.modelsContainerPos);
          
          if (distance > ANATOMY_CONSTANTS.HAND_DISTANCE_THRESHOLD) {
            this.lastGestureTime.right = now;
            this.layerManager.nextLayer();
          }
        }
      });
    }
    
    if (leftHand) {
      leftHand.addEventListener('pinchstarted', (evt) => {
        const now = Date.now();
        if (now - this.lastGestureTime.left < ANATOMY_CONSTANTS.GESTURE_COOLDOWN) {
          return;
        }
        
        const leftHandPos = new THREE.Vector3();
        leftHand.object3D.getWorldPosition(leftHandPos);
        
        if (modelsContainer) {
          modelsContainer.object3D.getWorldPosition(this.modelsContainerPos);
          const distance = leftHandPos.distanceTo(this.modelsContainerPos);
          
          if (distance > ANATOMY_CONSTANTS.HAND_DISTANCE_THRESHOLD) {
            this.lastGestureTime.left = now;
            this.layerManager.previousLayer();
          }
        }
      });
    }
  }
}

