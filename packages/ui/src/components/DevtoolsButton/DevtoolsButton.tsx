import { component$, useSignal, $, useTask$ } from "@qwik.dev/core";
import type { State } from "../../types/state"; // Assuming State type is defined elsewhere

interface DevtoolsButtonProps {
  state: State;
}

export const DevtoolsButton = component$(({ state }: DevtoolsButtonProps) => {
  // Signal for the button's position (distance from bottom-right corner)
  const position = useSignal({ x: 16, y: 16 });
  // Signal to track if the element is currently being dragged
  const isDragging = useSignal(false);
  // Ref for the draggable element
  const elementRef = useSignal<HTMLDivElement>();
  // Signal to store mouse position at drag start
  const startMousePos = useSignal({ x: 0, y: 0 });
  // Signal to store element position at drag start
  const startElementPos = useSignal({ x: 0, y: 0 });
  const isMoved = useSignal(false);
  // Signal to flag if a drag operation just finished, to prevent click

  /**
   * Handles mouse movement during drag. Defined outside handleMouseDown$ for serialization.
   */
  const handleMouseMove = $((event: MouseEvent) => {
    if (!isDragging.value) return;
    const deltaX = event.clientX - startMousePos.value.x;
    const deltaY = event.clientY - startMousePos.value.y;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      isMoved.value = true; 
    }
    let newX = startElementPos.value.x - deltaX;
    let newY = startElementPos.value.y - deltaY;

    newX = Math.max(0, newX);
    newY = Math.max(0, newY);

    position.value = { x: newX, y: newY };
    
  });

  /**
   * Handles mouse release to end drag. Defined outside handleMouseDown$ for serialization.
   */
  const handleMouseUp = $(() => {
    if (isDragging.value) {
        isDragging.value = false; // Stop dragging
    } 
    if (!isMoved.value) {
      state.isOpen.value = !state.isOpen.value;
    }
  
  });

  /**
   * Handles the mouse down event to initiate dragging.
   */
  const handleMouseDown = $((event: MouseEvent) => {
    if (event.button !== 0) return;
    if (!elementRef.value) return;

    event.preventDefault();

    startMousePos.value = { x: event.clientX, y: event.clientY };
    const computedStyle = window.getComputedStyle(elementRef.value);
    const currentRight = parseFloat(computedStyle.right) || 0;
    const currentBottom = parseFloat(computedStyle.bottom) || 0;
    startElementPos.value = { x: currentRight, y: currentBottom };
    position.value = { x: currentRight, y: currentBottom };

    isDragging.value = true;
    isMoved.value = false;
  });

  // Effect to add/remove window event listeners based on dragging state
  useTask$(({ track, cleanup }) => {
    track(() => isDragging.value);
    if (isDragging.value && typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      cleanup(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      });
    }
  });


  return (
    <div
      ref={elementRef}
      class={{
        "fixed flex h-9 w-9 origin-center items-center justify-center rounded-lg border border-white/10 bg-zinc-900 backdrop-blur-md select-none": true,
        "rotate-90 border-emerald-500/50 bg-zinc-900/95 shadow-lg shadow-emerald-500/35": state.isOpen.value && !isDragging.value,
        "cursor-grab": !isDragging.value,
        "cursor-grabbing": isDragging.value,
        "transition-all duration-300 ease-in-out": !isDragging.value,
      }}
      style={{
        bottom: `${position.value.y}px`,
        right: `${position.value.x}px`,
        userSelect: isDragging.value ? 'none' : undefined,
        transition: isDragging.value ? 'none' : undefined,
      }}
      onMouseDown$={handleMouseDown}
    >
      <img
        width={20}
        height={20}
        src="https://qwik.dev/logos/qwik-logo.svg"
        alt="Qwik Logo"
        draggable={false}
        class="h-5 w-5 opacity-90 drop-shadow-md pointer-events-none"
      />
    </div>
  );
});
