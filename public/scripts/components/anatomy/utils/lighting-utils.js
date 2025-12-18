export function updateLighting(layer) {
  const ambientLight = document.querySelector('[light][type="ambient"]');
  if (ambientLight) {
    ambientLight.setAttribute('animation__intensity', {
      property: 'light.intensity',
      from: ambientLight.getAttribute('light').intensity,
      to: 0.7,
      dur: 500,
      easing: 'easeInOutQuad'
    });
  }
}

