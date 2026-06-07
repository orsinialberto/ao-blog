/**
 * Base path per GitHub Pages
 * Deve corrispondere al basePath in next.config.ts
 * Per dominio personalizzato, lasciare vuoto
 */
const BASE_PATH = '';

/**
 * Aggiunge il basePath a un percorso se necessario
 * @param path - Percorso da normalizzare
 * @returns Percorso con basePath incluso
 */
export function withBasePath(path: string): string {
  // Se il percorso inizia già con il basePath, restituiscilo così com'è
  if (path.startsWith(BASE_PATH)) {
    return path;
  }
  
  // Se il percorso è assoluto (inizia con /), aggiungi il basePath
  if (path.startsWith('/')) {
    return `${BASE_PATH}${path}`;
  }
  
  // Altrimenti restituisci il percorso così com'è (percorsi relativi o URL assoluti)
  return path;
}

