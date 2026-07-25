/**
 * Simple LRU cache with a fixed maximum size.
 * Evicts least-recently-used entries when capacity is exceeded.
 */
export class LRUCache<K, V> {
  readonly #maxSize: number;
  readonly #map: Map<K, V>;

  constructor(maxSize: number) {
    this.#maxSize = maxSize;
    this.#map = new Map();
  }

  get(key: K): V | undefined {
    const val = this.#map.get(key);
    if (val !== undefined) {
      // Move to end (most recently used)
      this.#map.delete(key);
      this.#map.set(key, val);
    }
    return val;
  }

  set(key: K, value: V): void {
    if (this.#map.has(key)) {
      this.#map.delete(key);
    } else if (this.#map.size >= this.#maxSize) {
      // Evict oldest (first entry)
      const first = this.#map.keys().next().value;
      if (first !== undefined) {
        this.#map.delete(first);
      }
    }
    this.#map.set(key, value);
  }

  has(key: K): boolean {
    return this.#map.has(key);
  }

  clear(): void {
    this.#map.clear();
  }

  get size(): number {
    return this.#map.size;
  }
}
