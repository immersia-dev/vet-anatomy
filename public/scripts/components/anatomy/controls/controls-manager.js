(function() {
  'use strict';

  window.ANATOMY_CONTROLS = window.ANATOMY_CONTROLS || {};

  window.ANATOMY_CONTROLS.setupKeyboardControls = function(layerManager, interactionModeManager) {
    if (window.ANATOMY_CONTROLS._keyboardHandler) {
      document.removeEventListener('keydown', window.ANATOMY_CONTROLS._keyboardHandler);
    }
    
    window.ANATOMY_CONTROLS._keyboardHandler = (evt) => {
      if (evt.key === 'ArrowRight' || evt.key === 'd' || evt.key === 'D') {
        layerManager.nextLayer();
      } else if (evt.key === 'ArrowLeft' || evt.key === 'a' || evt.key === 'A') {
        layerManager.previousLayer();
      } else if (evt.key === 'r' || evt.key === 'R') {
        layerManager.reset();
      } else if (evt.key === 'h' || evt.key === 'H') {
        if (interactionModeManager && interactionModeManager.setMode) {
          interactionModeManager.setMode('hand-tracking');
        }
      } else if (evt.key === 'c' || evt.key === 'C') {
        if (interactionModeManager && interactionModeManager.setMode) {
          interactionModeManager.setMode('controllers');
        }
      }
    };
    
    document.addEventListener('keydown', window.ANATOMY_CONTROLS._keyboardHandler);
  };

  window.ANATOMY_CONTROLS.setupControllerButtons = function(layerManager) {
    if (!window.ANATOMY_CONTROLS._controllerSetup) {
      window.ANATOMY_CONTROLS._controllerSetup = true;
      window.ANATOMY_CONTROLS._lastThumbstickAction = { right: 0, left: 0 };
      const thumbstickCooldown = 500;
      
      const rightController = document.querySelector('#right-hand-controller');
      const leftController = document.querySelector('#left-hand-controller');
      
      if (rightController) {
        const rightNextHandler = () => layerManager.nextLayer();
        const rightThumbHandler = (evt) => {
          const now = Date.now();
          if (now - window.ANATOMY_CONTROLS._lastThumbstickAction.right < thumbstickCooldown) {
            return;
          }
          if (evt.detail.y > 0.7) {
            window.ANATOMY_CONTROLS._lastThumbstickAction.right = now;
            layerManager.nextLayer();
          }
        };
        
        rightController.addEventListener('abuttondown', rightNextHandler);
        rightController.addEventListener('xbuttondown', rightNextHandler);
        rightController.addEventListener('thumbstickmoved', rightThumbHandler);
      }
      
      if (leftController) {
        const leftPrevHandler = () => layerManager.previousLayer();
        const leftThumbHandler = (evt) => {
          const now = Date.now();
          if (now - window.ANATOMY_CONTROLS._lastThumbstickAction.left < thumbstickCooldown) {
            return;
          }
          if (evt.detail.y > 0.7) {
            window.ANATOMY_CONTROLS._lastThumbstickAction.left = now;
            layerManager.previousLayer();
          }
        };
        
        leftController.addEventListener('bbuttondown', leftPrevHandler);
        leftController.addEventListener('ybuttondown', leftPrevHandler);
        leftController.addEventListener('thumbstickmoved', leftThumbHandler);
      }
    }
  };

  window.ANATOMY_CONTROLS.setupHandGestures = function(layerManager) {
    if (!window.ANATOMY_CONTROLS._gestureSetup) {
      window.ANATOMY_CONTROLS._gestureSetup = true;
      window.ANATOMY_CONTROLS._lastGestureTime = { left: 0, right: 0 };
      const gestureCooldown = 500;
      const modelsContainerPos = new THREE.Vector3();
      
      const rightHand = document.querySelector('#right-hand-tracking');
      const leftHand = document.querySelector('#left-hand-tracking');
      const modelsContainer = document.querySelector('#anatomy-models-container');
      
      if (rightHand) {
        rightHand.addEventListener('pinchstarted', (evt) => {
          const now = Date.now();
          if (now - window.ANATOMY_CONTROLS._lastGestureTime.right < gestureCooldown) {
            return;
          }
          
          const rightHandPos = new THREE.Vector3();
          rightHand.object3D.getWorldPosition(rightHandPos);
          
          if (modelsContainer) {
            modelsContainer.object3D.getWorldPosition(modelsContainerPos);
            const distance = rightHandPos.distanceTo(modelsContainerPos);
            
            if (distance > 0.4) {
              window.ANATOMY_CONTROLS._lastGestureTime.right = now;
              layerManager.nextLayer();
            }
          }
        });
      }
      
      if (leftHand) {
        leftHand.addEventListener('pinchstarted', (evt) => {
          const now = Date.now();
          if (now - window.ANATOMY_CONTROLS._lastGestureTime.left < gestureCooldown) {
            return;
          }
          
          const leftHandPos = new THREE.Vector3();
          leftHand.object3D.getWorldPosition(leftHandPos);
          
          if (modelsContainer) {
            modelsContainer.object3D.getWorldPosition(modelsContainerPos);
            const distance = leftHandPos.distanceTo(modelsContainerPos);
            
            if (distance > 0.4) {
              window.ANATOMY_CONTROLS._lastGestureTime.left = now;
              layerManager.previousLayer();
            }
          }
        });
      }
    }
  };

})();

