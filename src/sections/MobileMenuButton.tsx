import type { RefObject } from 'react';

interface MobileMenuButtonProps {
  readonly buttonRef: RefObject<HTMLButtonElement | null>;
  readonly isOpen: boolean;
  readonly onClick: () => void;
}

export function MobileMenuButton({
  buttonRef,
  isOpen,
  onClick,
}: MobileMenuButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className="site-header-menu-trigger"
      data-open={isOpen}
      tabIndex={isOpen ? -1 : undefined}
      aria-expanded={isOpen}
      aria-controls={isOpen ? 'mobile-menu' : undefined}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <span className="site-header-menu-trigger-icon" aria-hidden="true">
        <span />
        <span />
      </span>
    </button>
  );
}
