import { setupTextElement } from '../utils/text-utils.js';
import { ANATOMY_CONSTANTS } from '../config/constants.js';

export class LayerControlUI {
  constructor(centerPosition) {
    this.centerPosition = centerPosition || ANATOMY_CONSTANTS.CENTER_POSITION;
    this.uiContainer = null;
    this.titleText = null;
    this.detailText = null;
    this.progressBar = null;
    this.progressMarkers = [];
    this.layerIndicator = null;
    this.activeDot = null;
    this.progressPercent = null;
    this.instructionText = null;
  }

  create(container) {
    const uiContainer = document.createElement('a-entity');
    uiContainer.setAttribute('id', 'layer-control-ui');
    const uiPosition = `${this.centerPosition.x} ${this.centerPosition.y + 2.5} ${this.centerPosition.z - 1.0}`;
    uiContainer.setAttribute('position', uiPosition);
    uiContainer.setAttribute('look-at', '#rig');
    
    this.createBackground(uiContainer);
    this.createLayerIndicator(uiContainer);
    this.createActiveDot(uiContainer);
    this.createTitleText(uiContainer);
    this.createDetailText(uiContainer);
    this.createProgressBar(uiContainer);
    this.createInstructionText(uiContainer);
    
    container.appendChild(uiContainer);
    this.uiContainer = uiContainer;
    
    return uiContainer;
  }

  createBackground(container) {
    const background = document.createElement('a-plane');
    background.setAttribute('width', '6.5');
    background.setAttribute('height', '1.6');
    background.setAttribute('position', '0 0 0.01');
    background.setAttribute('color', '#FFFFFF');
    background.setAttribute('opacity', '0.1');
    background.setAttribute('side', 'double');
    background.setAttribute('material', 'transparent: true; opacity: 0.1');
    container.appendChild(background);
    
    const border = document.createElement('a-plane');
    border.setAttribute('width', '6.5');
    border.setAttribute('height', '1.6');
    border.setAttribute('position', '0 0 0.011');
    border.setAttribute('color', '#FFFFFF');
    border.setAttribute('opacity', '0.2');
    border.setAttribute('material', 'transparent: true; opacity: 0.2');
    border.setAttribute('geometry', 'primitive: plane; width: 6.5; height: 1.6');
    container.appendChild(border);
  }

  createLayerIndicator(container) {
    const layerIndicator = document.createElement('a-text');
    layerIndicator.setAttribute('id', 'layer-indicator-text');
    layerIndicator.setAttribute('value', 'Camada 1 de 6');
    layerIndicator.setAttribute('align', 'left');
    layerIndicator.setAttribute('position', '-3.0 0.65 0.02');
    layerIndicator.setAttribute('color', '#FFFFFF');
    layerIndicator.setAttribute('opacity', '0.5');
    layerIndicator.setAttribute('width', '10');
    layerIndicator.setAttribute('scale', '0.3 0.3 0.3');
    setupTextElement(layerIndicator);
    container.appendChild(layerIndicator);
    this.layerIndicator = layerIndicator;
  }

  createActiveDot(container) {
    const activeDot = document.createElement('a-circle');
    activeDot.setAttribute('id', 'layer-active-dot');
    activeDot.setAttribute('radius', '0.03');
    activeDot.setAttribute('position', '3.0 0.65 0.02');
    activeDot.setAttribute('color', '#22D3EE');
    activeDot.setAttribute('opacity', '1');
    container.appendChild(activeDot);
    this.activeDot = activeDot;
  }

  createTitleText(container) {
    const titleText = document.createElement('a-text');
    titleText.setAttribute('id', 'layer-title-text');
    titleText.setAttribute('value', 'Bem-vindo');
    titleText.setAttribute('align', 'center');
    titleText.setAttribute('position', '0 0.35 0.02');
    titleText.setAttribute('color', '#FFFFFF');
    titleText.setAttribute('opacity', '0.9');
    titleText.setAttribute('width', '11');
    titleText.setAttribute('scale', '0.75 0.75 0.75');
    setupTextElement(titleText);
    container.appendChild(titleText);
    this.titleText = titleText;
  }

  createDetailText(container) {
    const detailText = document.createElement('a-text');
    detailText.setAttribute('id', 'layer-detail-text');
    detailText.setAttribute('value', '');
    detailText.setAttribute('align', 'center');
    detailText.setAttribute('position', '0 -0.076 0.02');
    detailText.setAttribute('color', '#FFFFFF');
    detailText.setAttribute('opacity', '0.7');
    detailText.setAttribute('width', '14');
    detailText.setAttribute('scale', '0.38 0.38 1');
    detailText.setAttribute('wrap-count', '60');
    setupTextElement(detailText);
    container.appendChild(detailText);
    this.detailText = detailText;
  }

  createProgressBar(container) {
    const progressBarBg = document.createElement('a-plane');
    progressBarBg.setAttribute('width', '4.5');
    progressBarBg.setAttribute('height', '0.08');
    progressBarBg.setAttribute('position', '0 -0.4 0.02');
    progressBarBg.setAttribute('color', '#FFFFFF');
    progressBarBg.setAttribute('opacity', '0.1');
    progressBarBg.setAttribute('material', 'transparent: true; opacity: 0.1');
    container.appendChild(progressBarBg);
    
    this.progressMarkers = [];
    for (let i = 0; i < 6; i++) {
      const marker = document.createElement('a-circle');
      const markerX = -2.25 + (i * 0.9);
      marker.setAttribute('radius', '0.022');
      marker.setAttribute('position', `${markerX} -0.4 0.021`);
      marker.setAttribute('color', '#FFFFFF');
      marker.setAttribute('opacity', '0.3');
      container.appendChild(marker);
      this.progressMarkers.push(marker);
    }
    
    const progressBar = document.createElement('a-plane');
    progressBar.setAttribute('id', 'layer-progress-bar');
    progressBar.setAttribute('width', '0.9');
    progressBar.setAttribute('height', '0.08');
    progressBar.setAttribute('position', '-2.025 -0.4 0.03');
    progressBar.setAttribute('color', '#22D3EE');
    progressBar.setAttribute('opacity', '1');
    container.appendChild(progressBar);
    this.progressBar = progressBar;
    
    const progressPercent = document.createElement('a-text');
    progressPercent.setAttribute('id', 'layer-progress-percent');
    progressPercent.setAttribute('value', '17%');
    progressPercent.setAttribute('align', 'right');
    progressPercent.setAttribute('position', '2.8 -0.4 0.02');
    progressPercent.setAttribute('color', '#FFFFFF');
    progressPercent.setAttribute('opacity', '0.7');
    progressPercent.setAttribute('width', '10');
    progressPercent.setAttribute('scale', '0.3 0.3 0.3');
    setupTextElement(progressPercent);
    container.appendChild(progressPercent);
    this.progressPercent = progressPercent;
  }

  createInstructionText(container) {
    const instructionText = document.createElement('a-text');
    instructionText.setAttribute('id', 'layer-instruction-text');
    instructionText.setAttribute('value', 'Botão A = próximo | Botão Y = anterior | Teclado: D/→ = próximo | A/← = anterior');
    instructionText.setAttribute('align', 'center');
    instructionText.setAttribute('position', '0 -0.6 0.02');
    instructionText.setAttribute('color', '#FFFFFF');
    instructionText.setAttribute('opacity', '0.6');
    instructionText.setAttribute('width', '14');
    instructionText.setAttribute('scale', '0.26 0.26 0.26');
    instructionText.setAttribute('wrap-count', '70');
    setupTextElement(instructionText);
    container.appendChild(instructionText);
    this.instructionText = instructionText;
  }

  update(layer, currentLayerIndex, totalLayers, currentMode) {
    if (!this.titleText || !this.detailText || !this.progressBar) return;
    
    const layerColor = layer.color || '#22D3EE';
    
    if (this.layerIndicator) {
      this.layerIndicator.setAttribute('value', `Camada ${currentLayerIndex + 1} de ${totalLayers}`);
    }
    
    if (this.activeDot) {
      this.activeDot.setAttribute('animation__color', {
        property: 'color',
        from: this.activeDot.getAttribute('color'),
        to: layerColor,
        dur: 300,
        easing: 'easeOutQuad'
      });
    }
    
    this.titleText.setAttribute('value', layer.description || layer.name);
    this.titleText.setAttribute('animation__color', {
      property: 'color',
      from: this.titleText.getAttribute('color'),
      to: '#FFFFFF',
      dur: 300,
      easing: 'easeOutQuad'
    });
    
    this.detailText.setAttribute('value', layer.detail || layer.description || '');
    
    const progress = currentLayerIndex / (totalLayers - 1);
    const barWidth = 4.5 * progress;
    const barPosition = -2.25 + (barWidth / 2);
    const progressPercent = Math.round(progress * 100);
    
    if (this.progressPercent) {
      this.progressPercent.setAttribute('value', `${progressPercent}%`);
    }
    
    this.progressBar.setAttribute('animation__width', {
      property: 'width',
      from: this.progressBar.getAttribute('width'),
      to: barWidth,
      dur: 300,
      easing: 'easeOutQuad'
    });
    
    this.progressBar.setAttribute('animation__position', {
      property: 'position',
      from: this.progressBar.getAttribute('position'),
      to: `${barPosition} -0.4 0.03`,
      dur: 300,
      easing: 'easeOutQuad'
    });
    
    this.progressBar.setAttribute('animation__color', {
      property: 'color',
      from: this.progressBar.getAttribute('color'),
      to: layerColor,
      dur: 300,
      easing: 'easeOutQuad'
    });
    
    if (this.progressMarkers) {
      this.progressMarkers.forEach((marker, index) => {
        const markerX = -2.25 + (index * 0.9);
        marker.setAttribute('position', `${markerX} -0.4 0.021`);
        
        if (index <= currentLayerIndex) {
          marker.setAttribute('animation__color', {
            property: 'color',
            from: marker.getAttribute('color'),
            to: layerColor,
            dur: 300,
            easing: 'easeOutQuad'
          });
          marker.setAttribute('animation__opacity', {
            property: 'opacity',
            from: marker.getAttribute('opacity'),
            to: 1,
            dur: 300,
            easing: 'easeOutQuad'
          });
        } else {
          marker.setAttribute('animation__color', {
            property: 'color',
            from: marker.getAttribute('color'),
            to: '#FFFFFF',
            dur: 300,
            easing: 'easeOutQuad'
          });
          marker.setAttribute('animation__opacity', {
            property: 'opacity',
            from: marker.getAttribute('opacity'),
            to: 0.3,
            dur: 300,
            easing: 'easeOutQuad'
          });
        }
      });
    }
    
    this.updateInstructionText(currentMode);
  }

  updateInstructionText(currentMode) {
    if (!this.instructionText) return;
    
    let instructionValue = '';
    if (currentMode === 'hand-tracking') {
      instructionValue = 'Pinça esquerda: anterior  |  Pinça direita: próximo';
    } else {
      instructionValue = 'Botão A = próximo | Botão Y = anterior | Teclado: D/→ = próximo | A/← = anterior';
    }
    
    this.instructionText.setAttribute('value', instructionValue);
    this.instructionText.setAttribute('opacity', '0.6');
  }

  setVisible(visible) {
    if (this.uiContainer) {
      this.uiContainer.setAttribute('visible', visible);
    }
  }

  remove() {
    if (this.uiContainer) {
      this.uiContainer.remove();
    }
  }
}

