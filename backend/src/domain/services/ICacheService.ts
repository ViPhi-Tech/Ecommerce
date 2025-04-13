export interface ICacheService {
    /**
     * Recupera um valor do cache
     * @param key Chave do cache
     * @returns O valor armazenado ou null se não existir
     */
    get<T>(key: string): Promise<T | null>;
  
    /**
     * Armazena um valor no cache
     * @param key Chave do cache
     * @param value Valor a ser armazenado
     * @param ttlSeconds Tempo de vida em segundos (opcional)
     */
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  
    /**
     * Remove um valor do cache
     * @param key Chave do cache
     */
    del(key: string): Promise<void>;
  
    /**
     * Remove valores do cache que correspondem a um padrão
     * @param pattern Padrão de chave (ex: "products:*")
     */
    delPattern(pattern: string): Promise<void>;
  
    /**
     * Verifica se uma chave existe no cache
     * @param key Chave do cache
     * @returns true se existir, false caso contrário
     */
    exists(key: string): Promise<boolean>;
  
    /**
     * Incrementa um contador no cache
     * @param key Chave do contador
     * @param increment Valor a incrementar (padrão: 1)
     * @returns O novo valor do contador
     */
    increment(key: string, increment?: number): Promise<number>;
  
    /**
     * Obtém um valor do cache ou executa uma função para obtê-lo
     * @param key Chave do cache
     * @param fallbackFn Função para obter o valor se não estiver no cache
     * @param ttlSeconds Tempo de vida em segundos (opcional)
     * @returns O valor do cache ou o resultado da função
     */
    getOrSet<T>(key: string, fallbackFn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
  }