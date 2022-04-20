function main() {
  new Draggable("#my-draggable");
}

class Draggable {
  private element: HTMLElement;

  private currentDrag: undefined | {
    initialMouseX: number,
    initialMouseY: number,
    initialElementX: number,
    initialElementY: number,
    removeListeners: () => void,
  };

  constructor(selector: string) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error('Element not found');
    }
    this.element = element as HTMLElement;
    this.element.addEventListener('mousedown', (event) => this.onDragStart(event));
  }

  private onDragStart(event: MouseEvent): void {
    const mousemoveListener = (event: MouseEvent) => this.onDrag(event);
    window.addEventListener('mousemove', mousemoveListener);

    const mouseupListener = () => this.onDragEnd();
    window.addEventListener('mouseup', mouseupListener);

    const removeListeners = () => {
      window.removeEventListener('mousemove', mousemoveListener);
      window.removeEventListener('mouseup', mouseupListener);
    };

    const rect = this.element.getBoundingClientRect();

    this.currentDrag = {
      initialMouseX: event.clientX,
      initialMouseY: event.clientY,
      initialElementX: rect.left,
      initialElementY: rect.top,
      removeListeners,
    }
  }

  private onDrag(event: MouseEvent): void {
    if (!this.currentDrag) {
      return;
    }

    const x = this.currentDrag.initialElementX + event.clientX - this.currentDrag.initialMouseX;
    const y = this.currentDrag.initialElementY + event.clientY - this.currentDrag.initialMouseY;

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  private onDragEnd(): void {
    if (!this.currentDrag) {
      return;
    }

    this.currentDrag.removeListeners();
    this.currentDrag = undefined;
  }
}

main();
