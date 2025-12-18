export const LAYERS_CONFIG = [
  { 
    name: 'inicial', 
    visible: [],
    description: 'Bem-vindo',
    detail: 'Use os controles para navegar entre as camadas anatômicas',
    color: '#22D3EE'
  },
  { 
    name: 'esqueleto', 
    visible: ['bones'],
    description: 'Sistema Esquelético',
    detail: 'Estrutura de suporte do corpo - Forma e proteção dos órgãos internos',
    color: '#E5E7EB'
  },
  { 
    name: 'circulatorio', 
    visible: ['bones', 'circulatory-blue', 'circulatory-red'],
    description: 'Sistema Circulatório',
    detail: 'Artérias (vermelho) transportam sangue rico em oxigênio | Veias (azul) retornam sangue ao coração',
    color: '#EF4444'
  },
  { 
    name: 'orgaos', 
    visible: ['bones', 'circulatory-blue', 'circulatory-red', 'heart', 'lungs', 'liver', 'guts', 'brain', 'testicles'],
    description: 'Órgãos Internos',
    detail: 'Coração, Pulmões, Fígado, Intestinos, Cérebro, Testículos - Sistemas vitais do organismo',
    color: '#8B5CF6'
  },
  { 
    name: 'muscular', 
    visible: ['bones', 'circulatory-blue', 'circulatory-red', 'heart', 'lungs', 'liver', 'guts', 'brain', 'testicles', 'muscle'],
    description: 'Sistema Muscular',
    detail: 'Músculos que envolvem a estrutura - Responsáveis pelo movimento e sustentação',
    color: '#DC2626'
  },
  { 
    name: 'pele', 
    visible: ['bones', 'circulatory-blue', 'circulatory-red', 'heart', 'lungs', 'liver', 'guts', 'brain', 'testicles', 'muscle', 'skin'],
    description: 'Pele',
    detail: 'Camada externa protetora - Primeira barreira de defesa do organismo',
    color: '#F59E0B'
  }
];

