export function setupTextElement(textElement) {
  if (window.setupTextFont) {
    window.setupTextFont(textElement);
  } else {
    textElement.setAttribute('font', '/assets/fonts/Exo2-Regular-msdf.json');
    textElement.setAttribute('font-image', '/assets/fonts/Exo2-Regular.png');
    textElement.setAttribute('negate', false);
  }
}

