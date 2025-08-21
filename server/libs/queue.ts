type Node<Type> = {
  value: Type;
  next: Node<Type> | null | undefined;
  prev: Node<Type> | null | undefined;
};

export class Queue<in out Type> {
  private map = new Map<Type, Node<Type>>();

  private head: Node<Type> | null | undefined;
  private tail: Node<Type> | null | undefined;

  private removeNode(node: Node<Type>) {
    const prev = node.prev;
    const next = node.next;

    if (prev) prev.next = next;
    else this.head = next;

    if (next) next.prev = prev;
    else this.tail = prev;

    node.next = null;
    node.prev = null;
  }

  enqueue(item: Type) {
    const node: Node<Type> = {
      value: item,
      next: null,
      prev: null,
    };

    this.map.set(item, node);

    if (!this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
  }

  dequeue() {
    if (!this.head) return undefined;

    const node = this.head;

    this.head = node.next;

    if (this.head) this.head.prev = null;
    else this.tail = null;

    node.next = null;
    node.prev = null;

    this.map.delete(node.value);

    return node.value;
  }

  remove(item: Type) {
    const node = this.map.get(item);

    if (!node) return;

    this.map.delete(item);
    this.removeNode(node);
  }
}
