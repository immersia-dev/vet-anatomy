import { ANATOMY_CONSTANTS } from '../config/constants.js';
import { SMALL_ORGANS } from '../config/models-config.js';

export class IsolatedModeManager {
  constructor(modelManager) {
    this.modelManager = modelManager;
    this.isActive = false;
    this.currentOrgan = null;
    this.savedLayerIndex = 0;
  }

  enable(organKey, savedLayerIndex = 0) {
    const model = this.modelManager.getModel(organKey);
    if (!model) {
      return;
    }
    
    this.isActive = true;
    this.currentOrgan = organKey;
    this.savedLayerIndex = savedLayerIndex;
    
    const isSmallOrgan = SMALL_ORGANS.includes(organKey);
    const isolatedScale = isSmallOrgan 
      ? ANATOMY_CONSTANTS.ISOLATED_SCALE_SMALL 
      : ANATOMY_CONSTANTS.ISOLATED_SCALE_LARGE;
    
    const models = this.modelManager.getAllModels();
    Object.keys(models).forEach(key => {
      const model = models[key];
      if (model) {
        if (key === organKey) {
          model.setAttribute('visible', true);
          model.setAttribute('scale', `${isolatedScale} ${isolatedScale} ${isolatedScale}`);
        } else {
          model.setAttribute('visible', false);
        }
      }
    });
    
    return { organKey };
  }

  disable() {
    if (!this.isActive) {
      return;
    }
    
    this.isActive = false;
    const savedLayer = this.savedLayerIndex;
    this.currentOrgan = null;
    this.savedLayerIndex = 0;
    
    return savedLayer;
  }

  isIsolated() {
    return this.isActive;
  }

  getCurrentOrgan() {
    return this.currentOrgan;
  }
}

