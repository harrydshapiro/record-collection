type SortedArrayCompareFn<T> = (a: T, b: T) => number;

export class SortedArray<T> extends Array {
  compareFn!: SortedArrayCompareFn<T>;

  constructor(compareFn: SortedArrayCompareFn<T>, arrayLength?: number) {
    super(arrayLength);
    this.compareFn = compareFn;
  }

  private sortArray() {
    this.sort(this.compareFn);
  }

  push(...items: any[]): number {
    const result = super.push(...items);
    this.sortArray();
    return result;
  }

  splice(start: number, deleteCount?: number, ...items: any[]): any[] {
    const result = super.splice(start, deleteCount, ...items);
    this.sortArray();
    return result;
  }

  unshift(...items: any[]): number {
    const result = super.unshift(...items);
    this.sortArray();
    return result;
  }
}
