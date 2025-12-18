(function() {
  'use strict';

  if (!window.ANATOMY) {
    console.error('ANATOMY module not loaded. Please load anatomy/index.js first.');
    return;
  }

  AFRAME.registerComponent('anatomy-layer-manager', {
    schema: {
      currentLayer: { type: 'number', default: 0 },
      autoAdvance: { type: 'boolean', default: false },
      autoAdvanceDelay: { type: 'number', default: 5000 }
    },

    init: function () {
      this.modelManager = new window.ANATOMY.ModelManager();
      this.layerManager = new window.ANATOMY.LayerManager(this.modelManager);
      this.isolatedModeManager = new window.ANATOMY.IsolatedModeManager(this.modelManager);
      
      this.centerPosition = { x: 0, y: 1.701, z: -2.5 };
      this.modelScale = 1.8;
      
      this.modelManager.repositionAllModels(this.centerPosition, this.modelScale);
      this.modelsContainer = this.modelManager.modelsContainer;
      
      if (window.ANATOMY_CONTROLS) {
        const interactionModeManager = this.el.sceneEl.components['interaction-mode-manager'];
        const layerManagerWrapper = {
          nextLayer: () => this.nextLayer(),
          previousLayer: () => this.previousLayer(),
          reset: () => this.reset()
        };
        window.ANATOMY_CONTROLS.setupKeyboardControls(layerManagerWrapper, interactionModeManager);
        window.ANATOMY_CONTROLS.setupControllerButtons(layerManagerWrapper);
        window.ANATOMY_CONTROLS.setupHandGestures(layerManagerWrapper);
      }
      
      this.onInteractionModeChanged = this.onInteractionModeChanged.bind(this);
      this.el.addEventListener('interaction-mode-changed', this.onInteractionModeChanged);
      
      if (window.ANATOMY_UI) {
        this.uiElements = window.ANATOMY_UI.createLayerControlUI(this.centerPosition, this.el);
      }
      
      if (this.el.hasLoaded) {
        this.updateLayer(this.data.currentLayer);
      } else {
        this.el.addEventListener('loaded', () => {
          this.updateLayer(this.data.currentLayer);
        });
      }
      
      if (this.data.autoAdvance) {
        this.setupAutoAdvance();
      }
    },

    updateLayer: function (layerIndex) {
      if (this.isolatedModeManager.isIsolated()) {
        return;
      }
      
      if (layerIndex < 0 || layerIndex >= this.layerManager.getTotalLayers()) {
        return;
      }
      
      const layerData = this.layerManager.updateLayer(layerIndex, false);
      if (!layerData) return;
      
      this.data.currentLayer = this.layerManager.currentLayerIndex;
      const layer = this.layerManager.getLayer(this.layerManager.currentLayerIndex);
      
      if (window.ANATOMY_UTILS) {
        window.ANATOMY_UTILS.updateLighting(layer);
      }
      
      this.el.emit('layer-changed', layerData);
      
      if (this.uiElements) {
        const currentMode = this.getCurrentInteractionMode();
        window.ANATOMY_UI.updateLayerControlUI(
          this.uiElements,
          layer,
          this.layerManager.currentLayerIndex,
          this.layerManager.getTotalLayers(),
          currentMode
        );
      }
      
      if (this.data.autoAdvance && layerIndex < this.layerManager.getTotalLayers() - 1) {
        clearTimeout(this.autoAdvanceTimeout);
        this.autoAdvanceTimeout = setTimeout(() => {
          this.nextLayer();
        }, this.data.autoAdvanceDelay);
      }
    },

    nextLayer: function () {
      if (this.isolatedModeManager.isIsolated()) {
        return;
      }
      if (this.layerManager.currentLayerIndex < this.layerManager.getTotalLayers() - 1) {
        this.updateLayer(this.layerManager.currentLayerIndex + 1);
      }
    },

    previousLayer: function () {
      if (this.isolatedModeManager.isIsolated()) {
        return;
      }
      if (this.layerManager.currentLayerIndex > 0) {
        this.updateLayer(this.layerManager.currentLayerIndex - 1);
      }
    },

    reset: function () {
      const layerData = this.layerManager.reset();
      if (layerData) {
        this.updateLayer(0);
      }
    },

    onInteractionModeChanged: function (evt) {
      if (this.uiElements) {
        const currentMode = this.getCurrentInteractionMode();
        const layer = this.layerManager.getCurrentLayer();
        window.ANATOMY_UI.updateLayerControlUI(
          this.uiElements,
          layer,
          this.layerManager.currentLayerIndex,
          this.layerManager.getTotalLayers(),
          currentMode
        );
      }
    },

    getCurrentInteractionMode: function () {
      const scene = this.el;
      const modeManager = scene.components['interaction-mode-manager'];
      return modeManager ? modeManager.data.mode : 'controllers';
    },

    updateControlUI: function (layer) {
      if (!this.uiElements) return;
      
      const currentMode = this.getCurrentInteractionMode();
      window.ANATOMY_UI.updateLayerControlUI(
        this.uiElements,
        layer,
        this.layerManager.currentLayerIndex,
        this.layerManager.getTotalLayers(),
        currentMode
      );
    },

    setIsolatedMode: function (organKey) {
      const savedLayerIndex = this.layerManager.currentLayerIndex;
      const result = this.isolatedModeManager.enable(organKey, savedLayerIndex);
      
      if (result && this.uiElements) {
        this.uiElements.container.setAttribute('visible', false);
      }
      
      this.el.emit('isolated-mode-enabled', result);
    },

    exitIsolatedMode: function () {
      const savedLayer = this.isolatedModeManager.disable();
      
      if (savedLayer !== null && this.uiElements) {
        this.uiElements.container.setAttribute('visible', true);
        this.updateLayer(savedLayer);
      }
      
      this.el.emit('isolated-mode-disabled');
    },

    isIsolatedMode: function () {
      return this.isolatedModeManager.isIsolated();
    },

    setupAutoAdvance: function () {
      if (this.data.autoAdvance) {
        const checkAdvance = () => {
          if (!this.isolatedModeManager.isIsolated() && 
              this.layerManager.currentLayerIndex < this.layerManager.getTotalLayers() - 1) {
            clearTimeout(this.autoAdvanceTimeout);
            this.autoAdvanceTimeout = setTimeout(() => {
              this.nextLayer();
              checkAdvance();
            }, this.data.autoAdvanceDelay);
          }
        };
        checkAdvance();
      }
    },

    remove: function () {
      if (this.autoAdvanceTimeout) {
        clearTimeout(this.autoAdvanceTimeout);
      }
      if (this.uiElements && this.uiElements.container) {
        this.uiElements.container.remove();
      }
    }
  });

})();
