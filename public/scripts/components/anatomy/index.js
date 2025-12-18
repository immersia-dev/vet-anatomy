(function() {
  'use strict';

  const ANATOMY = window.ANATOMY || {};

  ANATOMY.ModelManager = class {
    constructor() {
      this.models = {};
      this.modelsContainer = null;
      this.loadModels();
    }

    loadModels() {
      const modelIds = {
        'bones': '#bones',
        'circulatory-blue': '#circulatory-blue',
        'circulatory-red': '#circulatory-red',
        'heart': '#heart',
        'lungs': '#lungs',
        'liver': '#liver',
        'guts': '#guts',
        'brain': '#brain',
        'testicles': '#testicles',
        'muscle': '#muscle',
        'skin': '#skin'
      };

      Object.keys(modelIds).forEach(key => {
        this.models[key] = document.querySelector(modelIds[key]);
        if (!this.models[key]) {
          setTimeout(() => {
            this.models[key] = document.querySelector(modelIds[key]);
          }, 100);
        }
      });
    }

    repositionAllModels(centerPosition, modelScale) {
      const pos = centerPosition || { x: 0, y: 1.701, z: -2.5 };
      const scale = modelScale || 1.8;
      
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
  };

  ANATOMY.LayerManager = class {
    constructor(modelManager) {
      this.layers = [
        { name: 'inicial', visible: [], description: 'Bem-vindo', detail: 'Use os controles para navegar entre as camadas anatômicas', color: '#22D3EE' },
        { name: 'esqueleto', visible: ['bones'], description: 'Sistema Esquelético', detail: 'Estrutura de suporte do corpo - Forma e proteção dos órgãos internos', color: '#E5E7EB' },
        { name: 'circulatorio', visible: ['bones', 'circulatory-blue', 'circulatory-red'], description: 'Sistema Circulatório', detail: 'Artérias (vermelho) transportam sangue rico em oxigênio | Veias (azul) retornam sangue ao coração', color: '#EF4444' },
        { name: 'orgaos', visible: ['bones', 'circulatory-blue', 'circulatory-red', 'heart', 'lungs', 'liver', 'guts', 'brain', 'testicles'], description: 'Órgãos Internos', detail: 'Coração, Pulmões, Fígado, Intestinos, Cérebro, Testículos - Sistemas vitais do organismo', color: '#8B5CF6' },
        { name: 'muscular', visible: ['bones', 'circulatory-blue', 'circulatory-red', 'heart', 'lungs', 'liver', 'guts', 'brain', 'testicles', 'muscle'], description: 'Sistema Muscular', detail: 'Músculos que envolvem a estrutura - Responsáveis pelo movimento e sustentação', color: '#DC2626' },
        { name: 'pele', visible: ['bones', 'circulatory-blue', 'circulatory-red', 'heart', 'lungs', 'liver', 'guts', 'brain', 'testicles', 'muscle', 'skin'], description: 'Pele', detail: 'Camada externa protetora - Primeira barreira de defesa do organismo', color: '#F59E0B' }
      ];
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
        return null;
      }
      
      const layer = this.layers[layerIndex];
      const previousLayer = this.layers[this.currentLayerIndex];
      const newModels = layer.visible.filter(key => !previousLayer.visible.includes(key));
      const hasSkin = layer.visible.includes('skin');
      const scaleValue = 1.8;
      
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
  };

  ANATOMY.IsolatedModeManager = class {
    constructor(modelManager) {
      this.modelManager = modelManager;
      this.isActive = false;
      this.currentOrgan = null;
      this.savedLayerIndex = 0;
      this.smallOrgans = ['heart', 'lungs', 'liver', 'guts', 'brain', 'testicles'];
    }

    enable(organKey, savedLayerIndex = 0) {
      const model = this.modelManager.getModel(organKey);
      if (!model) {
        return null;
      }
      
      this.isActive = true;
      this.currentOrgan = organKey;
      this.savedLayerIndex = savedLayerIndex;
      
      const isSmallOrgan = this.smallOrgans.includes(organKey);
      const isolatedScale = isSmallOrgan ? 5 : 2.2;
      
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
        return null;
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
  };

  ANATOMY.ORGAN_LIST = [
    { key: 'bones', name: 'Ossos', color: '#E5E7EB' },
    { key: 'circulatory-red', name: 'Sistema Circulatório', color: '#EF4444' },
    { key: 'circulatory-blue', name: 'Sistema Circulatório', color: '#3B82F6' },
    { key: 'heart', name: 'Coração', color: '#8B5CF6' },
    { key: 'lungs', name: 'Pulmões', color: '#8B5CF6' },
    { key: 'liver', name: 'Fígado', color: '#8B5CF6' },
    { key: 'guts', name: 'Intestinos', color: '#8B5CF6' },
    { key: 'brain', name: 'Cérebro', color: '#8B5CF6' },
    { key: 'testicles', name: 'Testículos', color: '#8B5CF6' },
    { key: 'muscle', name: 'Músculos', color: '#DC2626' },
    { key: 'skin', name: 'Pele', color: '#F59E0B' }
  ];

  window.ANATOMY = ANATOMY;
})();

