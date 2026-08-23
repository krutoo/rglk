/**
 * Disjoint Set Union.
 * Needs to find loops in graphs.
 */
export class DSU {
  protected parent: number[];

  constructor(vertexCount: number) {
    this.parent = Array(vertexCount).keys().toArray();
  }

  find(i: number): number {
    if (this.parent[i] === i) {
      return i;
    }

    this.parent[i] = this.find(this.parent[i]!);

    return this.parent[i];
  }

  union(i: number, j: number): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;

      return true;
    }

    return false;
  }
}
