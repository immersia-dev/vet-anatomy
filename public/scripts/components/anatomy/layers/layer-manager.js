import { LAYERS_CONFIG } from '../config/layers-config.js';
import { ANATOMY_CONSTANTS } from '../config/constants.js';

export class LayerManager {
  constructor(modelManager) {
    this.layers = LAYERS_CONFIG;
    this.modelManager = modelManager;
    this.currentLayerIndex = 0;
  }

  getLayer(index) {
    return this.layers[index];
  }

  getCurrentLayer() {
    return this.layers[this.currentLayerIndex];
  }

  updateLayer(layerIndex, isolatedMode = false) {
    if (layerIndex < 0 || layerIndex >= this.layers.length || isolatedMode) {
      return;
    }
    
    const layer = this.layers[layerIndex];
    const previousLayer = this.layers[this.currentLayerIndex];
    const newModels = layer.visible.filter(key => !previousLayer.visible.includes(key));
    const hasSkin = layer.visible.includes('skin');
    const scaleValue = ANATOMY_CONSTANTS.MODEL_SCALE;
    
    const models = this.modelManager.getAllModels();
    Object.keys(models).forEach(key => {
      const model = models[key];
      if (!model) return;
      
      const isVisible = layer.visible.includes(key);
      const shouldHide = hasSkin && key !== 'skin';
      
      model.setAttribute('scale', `${scaleValue} ${scaleValue} ${scaleValue}`);
      model.removeAttribute('animation__show');
      model.removeAttribute('animation__hide');
      model.removeAttribute('animation__pulse');
      
      if (isVisible && !shouldHide) {
        model.setAttribute('visible', true);
      } else {
        model.setAttribute('visible', false);
      }
    });
    
    this.currentLayerIndex = layerIndex;
    
    return {
      layer: layerIndex,
      layerName: layer.name,
      description: layer.description,
      detail: layer.detail,
      visibleModels: layer.visible,
      newModels: newModels
    };
  }

  nextLayer() {
    if (this.currentLayerIndex < this.layers.length - 1) {
      return this.updateLayer(this.currentLayerIndex + 1);
    }
    return null;
  }

  previousLayer() {
    if (this.currentLayerIndex > 0) {
      return this.updateLayer(this.currentLayerIndex - 1);
    }
    return null;
  }

  reset() {
    return this.updateLayer(0);
  }

  getTotalLayers() {
    return this.layers.length;
  }
}

