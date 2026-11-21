export interface DataStructure {
  insert(key: number): void;
  search(key: number): boolean;
  delete(key: number): boolean;
}
