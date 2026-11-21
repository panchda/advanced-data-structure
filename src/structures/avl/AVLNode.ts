export class AVLNode {
  public key: number;
  public height: number;
  public left: AVLNode | null;
  public right: AVLNode | null;

  constructor(key: number) {
    this.key = key;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}
