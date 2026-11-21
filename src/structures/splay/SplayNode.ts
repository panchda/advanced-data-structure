export class SplayNode {
  public key: number;
  public left: SplayNode | null;
  public right: SplayNode | null;

  constructor(key: number) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}
