import { MODELS_CONFIG } from '../config/models-config.js';
import { ANATOMY_CONSTANTS } from '../config/constants.js';

export class ModelManager {
  constructor() {
    this.models = {};
    this.modelsContainer = null;
    this.loadModels();
  }

  loadModels() {
    Object.keys(MODELS_CONFIG).forEach(key => {
      this.models[key] = document.querySelector(MODELS_CONFIG[key]);
    });
  }

  repositionAllModels(centerPosition, modelScale) {
    const pos = centerPosition || ANATOMY_CONSTANTS.CENTER_POSITION;
    const scale = modelScale || ANATOMY_CONSTANTS.MODEL_SCALE;
    
    let modelsContainer = document.querySelector('#anatomy-models-container');
    if (!modelsContainer) {
      modelsContainer = document.createElement('a-entity');
      modelsContainer.setAttribute('id', 'anatomy-models-container');
      const scene = document.querySelector('a-scene');
      if (scene) {
        scene.appendChild(modelsContainer);
      }
      this.modelsContainer = modelsContainer;
    }
    
    modelsContainer.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
    modelsContainer.setAttribute('rotation', '0 45 0');
    
    Object.values(this.models).forEach(model => {
      if (model) {
        if (model.parentNode) {
          model.parentNode.removeChild(model);
        }
        
        model.setAttribute('position', '0 0 0');
        model.setAttribute('rotation', '0 0 0');
        model.setAttribute('scale', `${scale} ${scale} ${scale}`);
        
        modelsContainer.appendChild(model);
      }
    });
    
    return modelsContainer;
  }

  getModel(key) {
    return this.models[key];
  }

  getAllModels() {
    return this.models;
  }

  updateModelVisibility(key, visible) {
    const model = this.models[key];
    if (model) {
      model.setAttribute('visible', visible);
    }
  }

  updateModelScale(key, scale) {
    const model = this.models[key];
    if (model) {
      model.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }
  }

  hideAllModels() {
    Object.keys(this.models).forEach(key => {
      this.updateModelVisibility(key, false);
    });
  }
}

