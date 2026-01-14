/**
 * Chromatic Configuration
 * 
 * Configuração para visual regression testing com Chromatic.
 * 
 * Para usar, configure a variável de ambiente CHROMATIC_PROJECT_TOKEN
 * ou passe --project-token como argumento.
 */

module.exports = {
  // Threshold para diferenças visuais (0-1)
  // 0.01 = 1% de diferença é aceitável
  diffThreshold: 0.01,
  
  // Testar apenas stories que mudaram (útil para CI/CD)
  onlyChanged: process.env.CI === 'true',
  
  // Viewports customizados (opcional, usa os do Storybook por padrão)
  // viewports: [
  //   { width: 375, height: 667 },   // Mobile
  //   { width: 768, height: 1024 },  // Tablet
  //   { width: 1280, height: 800 },   // Desktop
  // ],
  
  // Pausar animações no final para screenshots consistentes
  pauseAnimationAtEnd: true,
  
  // Timeout para captura de screenshots (ms)
  captureTimeout: 30000,
  
  // Número de tentativas em caso de falha
  retries: 2,
  
  // Build directory (usar build existente se disponível)
  // storybookBuildDir: 'storybook-static',
};
