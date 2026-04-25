import { useRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useOverlayBehavior } from '../src/hooks/useOverlayBehavior';

function OverlayHarness() {
  const [isOpen, setIsOpen] = useState(false);
  const [panelVersion, setPanelVersion] = useState(1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useOverlayBehavior({
    isOpen,
    containerRef: overlayRef,
    initialFocusRef: closeButtonRef,
    restoreFocusRef: triggerRef,
    onClose: () => setIsOpen(false),
  });

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setIsOpen(true)}>
        Open overlay
      </button>

      {isOpen && (
        <div ref={overlayRef} role="dialog" aria-label="Example overlay" tabIndex={-1}>
          <button ref={closeButtonRef} type="button" onClick={() => setIsOpen(false)}>
            Close overlay
          </button>
          <button type="button" onClick={() => setPanelVersion((version) => version + 1)}>
            Rerender overlay
          </button>
          <p>Panel version {panelVersion}</p>
        </div>
      )}
    </>
  );
}

describe('useOverlayBehavior', () => {
  it('keeps focus inside an open overlay across internal rerenders', async () => {
    const user = userEvent.setup();
    render(<OverlayHarness />);

    const trigger = screen.getByRole('button', { name: /open overlay/i });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /example overlay/i });
    const closeButton = screen.getByRole('button', { name: /close overlay/i });

    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByRole('button', { name: /rerender overlay/i }));

    expect(trigger).not.toHaveFocus();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    await user.keyboard('{Escape}');

    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });
});
