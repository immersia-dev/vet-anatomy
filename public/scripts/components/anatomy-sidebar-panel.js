(function() {
  'use strict';

  AFRAME.registerComponent('anatomy-sidebar-panel', {
    schema: {
      position: { type: 'vec3', default: { x: -4.5, y: 3, z: -1.5 } },
      visible: { type: 'boolean', default: true }
    },

    init: function () {
      this.isPanelVisible = true;
      this.isolatedMode = false;
      this.selectedOrgan = null;
      this.savedLayerIndex = 0;
      
      this.organList = window.ANATOMY && window.ANATOMY.ORGAN_LIST 
        ? window.ANATOMY.ORGAN_LIST 
        : [
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
      
      this.layerManager = null;
      this.panelCreated = false;
      this.toggleButtonCreated = false;
      
      const findLayerManager = () => {
        const scene = this.el.sceneEl || document.querySelector('a-scene');
        if (scene) {
          this.layerManager = scene.components['anatomy-layer-manager'];
        }
        
        if (!this.toggleButtonCreated) {
          this.createToggleButton();
          this.toggleButtonCreated = true;
        }
        
        if (!this.panelCreated) {
          this.createPanel();
          this.panelCreated = true;
        }
        
        if (!this.layerManager) {
          setTimeout(findLayerManager, 100);
        }
      };
      
      findLayerManager();
      
      this.el.addEventListener('organ-selected', this.onOrganSelected.bind(this));
      this.el.addEventListener('exit-isolated-mode', this.onExitIsolatedMode.bind(this));
      
      document.addEventListener('keydown', (evt) => {
        if (evt.key === 'p' || evt.key === 'P') {
          this.togglePanel();
        }
      });
    },

    createToggleButton: function () {
      const toggleButton = document.createElement('a-entity');
      toggleButton.setAttribute('id', 'sidebar-toggle-button');
      toggleButton.setAttribute('position', `${this.data.position.x + 0.6} ${this.data.position.y + 1.8} ${this.data.position.z}`);
      toggleButton.setAttribute('look-at', '#head');
      toggleButton.setAttribute('visible', true);
      toggleButton.setAttribute('class', 'sidebar-interactable');
      
      const buttonBg = document.createElement('a-plane');
      buttonBg.setAttribute('width', '0.45');
      buttonBg.setAttribute('height', '0.45');
      buttonBg.setAttribute('position', '0 0 0.01');
      buttonBg.setAttribute('color', '#FFFFFF');
      buttonBg.setAttribute('opacity', '0.1');
      buttonBg.setAttribute('material', 'transparent: true; opacity: 0.1');
      buttonBg.setAttribute('side', 'double');
      toggleButton.appendChild(buttonBg);
      
      const buttonText = document.createElement('a-text');
      buttonText.setAttribute('value', '☰');
      buttonText.setAttribute('align', 'center');
      buttonText.setAttribute('position', '0 0 0.02');
      buttonText.setAttribute('color', '#FFFFFF');
      buttonText.setAttribute('opacity', '0.7');
      buttonText.setAttribute('width', '5');
      buttonText.setAttribute('scale', '0.5 0.5 0.5');
      this.setupTextElement(buttonText);
      toggleButton.appendChild(buttonText);
      
      toggleButton.setAttribute('animation__hover', 'property: scale; to: 1.1 1.1 1; dur: 200; startEvents: mouseenter');
      toggleButton.setAttribute('animation__hoverout', 'property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave');
      toggleButton.setAttribute('cursor', 'rayOrigin: mouse');
      toggleButton.setAttribute('raycaster', 'objects: .sidebar-interactable');
      
      toggleButton.addEventListener('mouseenter', () => {
        buttonBg.setAttribute('animation__hover', {
          property: 'opacity',
          from: 0.1,
          to: 0.15,
          dur: 200,
          easing: 'easeOutQuad'
        });
        buttonText.setAttribute('animation__hover', {
          property: 'opacity',
          from: 0.7,
          to: 0.9,
          dur: 200,
          easing: 'easeOutQuad'
        });
      });
      
      toggleButton.addEventListener('mouseleave', () => {
        buttonBg.setAttribute('animation__hoverout', {
          property: 'opacity',
          from: 0.15,
          to: 0.1,
          dur: 200,
          easing: 'easeOutQuad'
        });
        buttonText.setAttribute('animation__hoverout', {
          property: 'opacity',
          from: 0.9,
          to: 0.7,
          dur: 200,
          easing: 'easeOutQuad'
        });
      });
      
      toggleButton.addEventListener('click', () => {
        this.togglePanel();
      });
      
      this.el.appendChild(toggleButton);
      this.toggleButton = toggleButton;
    },

    createPanel: function () {
      const panel = document.createElement('a-entity');
      panel.setAttribute('id', 'sidebar-panel');
      panel.setAttribute('position', `${this.data.position.x} ${this.data.position.y} ${this.data.position.z}`);
      panel.setAttribute('look-at', '#head');
      panel.setAttribute('visible', this.isPanelVisible);
      panel.setAttribute('class', 'sidebar-interactable');
      panel.setAttribute('raycaster', 'objects: .organ-button, .sidebar-interactable');
      
      const panelBg = document.createElement('a-plane');
      panelBg.setAttribute('width', '2.0');
      panelBg.setAttribute('height', '4.5');
      panelBg.setAttribute('position', '0 0 0.01');
      panelBg.setAttribute('color', '#FFFFFF');
      panelBg.setAttribute('opacity', '0.1');
      panelBg.setAttribute('material', 'transparent: true; opacity: 0.1');
      panelBg.setAttribute('side', 'double');
      panel.appendChild(panelBg);
      
      const titleText = document.createElement('a-text');
      titleText.setAttribute('id', 'sidebar-title');
      titleText.setAttribute('value', 'Órgãos');
      titleText.setAttribute('align', 'center');
      titleText.setAttribute('position', '0 1.75 0.03');
      titleText.setAttribute('color', '#FFFFFF');
      titleText.setAttribute('opacity', '0.9');
      titleText.setAttribute('width', '7');
      titleText.setAttribute('scale', '0.6 0.6 0.6');
      this.setupTextElement(titleText);
      panel.appendChild(titleText);
      
      const subtitleText = document.createElement('a-text');
      subtitleText.setAttribute('value', 'Visualização Isolada');
      subtitleText.setAttribute('align', 'center');
      subtitleText.setAttribute('position', '0 1.5 0.03');
      subtitleText.setAttribute('color', '#FFFFFF');
      subtitleText.setAttribute('opacity', '0.5');
      subtitleText.setAttribute('width', '8');
      subtitleText.setAttribute('scale', '0.35 0.35 0.35');
      this.setupTextElement(subtitleText);
      panel.appendChild(subtitleText);
      
      const organListContainer = document.createElement('a-entity');
      organListContainer.setAttribute('id', 'organ-list-container');
      organListContainer.setAttribute('position', '0 0.1 0');
      panel.appendChild(organListContainer);
      
      this.createOrganButtons(organListContainer);
      
      const exitButton = document.createElement('a-entity');
      exitButton.setAttribute('id', 'exit-isolated-button');
      exitButton.setAttribute('position', '0.0 2.6 0.02');
      exitButton.setAttribute('visible', false);
      exitButton.setAttribute('class', 'sidebar-interactable');
      exitButton.setAttribute('cursor', 'rayOrigin: mouse');
      
      const exitBg = document.createElement('a-plane');
      exitBg.setAttribute('width', '1.7');
      exitBg.setAttribute('height', '0.3');
      exitBg.setAttribute('position', '0 0 0.01');
      exitBg.setAttribute('color', '#22D3EE');
      exitBg.setAttribute('opacity', '1');
      exitBg.setAttribute('side', 'double');
      exitButton.appendChild(exitBg);
      
      const exitText = document.createElement('a-text');
      exitText.setAttribute('value', 'Voltar ao Modo Passo-a-Passo');
      exitText.setAttribute('align', 'center');
      exitText.setAttribute('position', '0 0 0.02');
      exitText.setAttribute('color', '#FFFFFF');
      exitText.setAttribute('opacity', '0.9');
      exitText.setAttribute('width', '5');
      exitText.setAttribute('scale', '0.28 0.28 0.28');
      exitText.setAttribute('wrap-count', '18');
      this.setupTextElement(exitText);
      exitButton.appendChild(exitText);
      
      exitButton.setAttribute('animation__hover', 'property: scale; to: 1.05 1.05 1; dur: 200; startEvents: mouseenter');
      exitButton.setAttribute('animation__hoverout', 'property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave');
      
      exitButton.addEventListener('click', () => {
        this.exitIsolatedMode();
      });
      
      panel.appendChild(exitButton);
      this.exitButton = exitButton;
      
      this.el.appendChild(panel);
      this.panel = panel;
    },

    createOrganButtons: function (container) {
      const buttonHeight = 0.24;
      const buttonSpacing = 0.08;
      const startY = 1.1;
      
      this.organList.forEach((organ, index) => {
        const button = document.createElement('a-entity');
        button.setAttribute('id', `organ-button-${organ.key}`);
        button.setAttribute('class', 'organ-button sidebar-interactable');
        button.setAttribute('data-organ-key', organ.key);
        
        const yPos = startY - (index * (buttonHeight + buttonSpacing));
        button.setAttribute('position', `0 ${yPos} 0.02`);
        
        const buttonBg = document.createElement('a-plane');
        buttonBg.setAttribute('width', '1.75');
        buttonBg.setAttribute('height', buttonHeight.toString());
        buttonBg.setAttribute('position', '0 0 0.01');
        buttonBg.setAttribute('color', '#FFFFFF');
        buttonBg.setAttribute('opacity', '0.05');
        buttonBg.setAttribute('material', 'transparent: true; opacity: 0.05');
        buttonBg.setAttribute('side', 'double');
        button.appendChild(buttonBg);
        
        const colorIndicator = document.createElement('a-plane');
        colorIndicator.setAttribute('width', '0.08');
        colorIndicator.setAttribute('height', buttonHeight.toString());
        colorIndicator.setAttribute('position', '-0.82 0 0.02');
        colorIndicator.setAttribute('color', organ.color);
        colorIndicator.setAttribute('opacity', '1');
        button.appendChild(colorIndicator);
        
        const activeDot = document.createElement('a-circle');
        activeDot.setAttribute('id', `organ-dot-${organ.key}`);
        activeDot.setAttribute('radius', '0.03');
        activeDot.setAttribute('position', '0.8 0 0.02');
        activeDot.setAttribute('color', '#22D3EE');
        activeDot.setAttribute('opacity', '0');
        button.appendChild(activeDot);
        
        const buttonText = document.createElement('a-text');
        buttonText.setAttribute('value', organ.name);
        buttonText.setAttribute('align', 'left');
        buttonText.setAttribute('position', '-0.65 0 0.02');
        buttonText.setAttribute('color', '#FFFFFF');
        buttonText.setAttribute('opacity', '0.7');
        buttonText.setAttribute('width', '3.5');
        buttonText.setAttribute('scale', '0.32 0.32 0.32');
        buttonText.setAttribute('wrap-count', '15');
        this.setupTextElement(buttonText);
        button.appendChild(buttonText);
        
        button.setAttribute('animation__hover', `property: scale; to: 1.02 1.02 1; dur: 200; startEvents: mouseenter`);
        button.setAttribute('animation__hoverout', `property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave`);
        button.setAttribute('animation__click', `property: scale; to: 0.98 0.98 1; dur: 100; startEvents: click`);
        
        button.addEventListener('mouseenter', () => {
          buttonBg.setAttribute('animation__hover', {
            property: 'opacity',
            from: 0.05,
            to: 0.1,
            dur: 200,
            easing: 'easeOutQuad'
          });
          buttonText.setAttribute('animation__hover', {
            property: 'opacity',
            from: 0.7,
            to: 0.9,
            dur: 200,
            easing: 'easeOutQuad'
          });
        });
        
        button.addEventListener('mouseleave', () => {
          if (!(this.isolatedMode && this.selectedOrgan === organ.key)) {
            buttonBg.setAttribute('animation__hoverout', {
              property: 'opacity',
              from: 0.1,
              to: 0.05,
              dur: 200,
              easing: 'easeOutQuad'
            });
            buttonText.setAttribute('animation__hoverout', {
              property: 'opacity',
              from: 0.9,
              to: 0.7,
              dur: 200,
              easing: 'easeOutQuad'
            });
          }
        });
        
        button.setAttribute('cursor', 'rayOrigin: mouse');
        
        button.addEventListener('click', () => {
          this.selectOrgan(organ.key);
        });
        
        container.appendChild(button);
      });
    },

    togglePanel: function () {
      this.isPanelVisible = !this.isPanelVisible;
      if (this.panel) {
        this.panel.setAttribute('visible', this.isPanelVisible);
        
        if (this.isPanelVisible) {
          this.panel.setAttribute('animation__show', {
            property: 'position',
            from: `${this.data.position.x - 0.5} ${this.data.position.y} ${this.data.position.z}`,
            to: `${this.data.position.x} ${this.data.position.y} ${this.data.position.z}`,
            dur: 300,
            easing: 'easeOutQuad'
          });
        }
      }
    },

    selectOrgan: function (organKey) {
      if (!this.layerManager) {
        return;
      }
      
      this.isolatedMode = true;
      this.selectedOrgan = organKey;
      this.savedLayerIndex = this.layerManager.data.currentLayer;
      
      this.layerManager.setIsolatedMode(organKey);
      
      this.updateButtonStates();
      if (this.exitButton) {
        this.exitButton.setAttribute('visible', true);
      }
      
      this.el.emit('organ-selected', { organKey: organKey });
    },

    exitIsolatedMode: function () {
      if (!this.layerManager) {
        return;
      }
      
      this.isolatedMode = false;
      this.selectedOrgan = null;
      
      this.layerManager.exitIsolatedMode();
      
      this.updateButtonStates();
      if (this.exitButton) {
        this.exitButton.setAttribute('visible', false);
      }
      
      this.el.emit('exit-isolated-mode');
    },

    updateButtonStates: function () {
      this.organList.forEach(organ => {
        const button = document.querySelector(`#organ-button-${organ.key}`);
        if (button) {
          const buttonBg = button.querySelector('a-plane');
          const buttonText = button.querySelector('a-text');
          const activeDot = button.querySelector(`#organ-dot-${organ.key}`);
          
          if (this.isolatedMode && this.selectedOrgan === organ.key) {
            buttonBg.setAttribute('animation__selected', {
              property: 'opacity',
              from: buttonBg.getAttribute('opacity'),
              to: 0.15,
              dur: 200,
              easing: 'easeOutQuad'
            });
            buttonBg.setAttribute('color', '#FFFFFF');
            
            if (buttonText) {
              buttonText.setAttribute('animation__selected', {
                property: 'opacity',
                from: buttonText.getAttribute('opacity'),
                to: 0.9,
                dur: 200,
                easing: 'easeOutQuad'
              });
            }
            
            if (activeDot) {
              activeDot.setAttribute('animation__selected', {
                property: 'opacity',
                from: activeDot.getAttribute('opacity'),
                to: 1,
                dur: 200,
                easing: 'easeOutQuad'
              });
            }
          } else {
            buttonBg.setAttribute('animation__default', {
              property: 'opacity',
              from: buttonBg.getAttribute('opacity'),
              to: 0.05,
              dur: 200,
              easing: 'easeOutQuad'
            });
            buttonBg.setAttribute('color', '#FFFFFF');
            
            if (buttonText) {
              buttonText.setAttribute('animation__default', {
                property: 'opacity',
                from: buttonText.getAttribute('opacity'),
                to: 0.7,
                dur: 200,
                easing: 'easeOutQuad'
              });
            }
            
            if (activeDot) {
              activeDot.setAttribute('animation__default', {
                property: 'opacity',
                from: activeDot.getAttribute('opacity'),
                to: 0,
                dur: 200,
                easing: 'easeOutQuad'
              });
            }
          }
        }
      });
    },

    onOrganSelected: function (evt) {
      this.updateButtonStates();
    },

    onExitIsolatedMode: function (evt) {
      this.updateButtonStates();
    },

    setupTextElement: function (textElement) {
      if (window.setupTextFont) {
        window.setupTextFont(textElement);
      } else {
        textElement.setAttribute('font', '/assets/fonts/Exo2-Regular-msdf.json');
        textElement.setAttribute('font-image', '/assets/fonts/Exo2-Regular.png');
        textElement.setAttribute('negate', false);
      }
    },

    remove: function () {
      if (this.panel) {
        this.panel.remove();
      }
      if (this.toggleButton) {
        this.toggleButton.remove();
      }
    }
  });

})();
