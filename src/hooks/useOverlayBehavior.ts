import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function isFocusableElement(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.hasAttribute('disabled') || element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  if (element.tabIndex < 0 && !element.matches('[contenteditable="true"]')) {
    return false;
  }

  return true;
}

function getFocusableElements(root: ParentNode | null): HTMLElement[] {
  if (!root) {
    return [];
  }

  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isFocusableElement);
}

function getFocusLoopElements(
  root: HTMLElement | null,
  externalFocusElement?: HTMLElement | null,
): HTMLElement[] {
  const focusable = getFocusableElements(root);

  if (
    root
    && externalFocusElement
    && isFocusableElement(externalFocusElement)
    && !root.contains(externalFocusElement)
  ) {
    return [externalFocusElement, ...focusable];
  }

  return focusable;
}

function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isLocked]);
}

interface UseOverlayBehaviorOptions {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  onClose?: () => void;
  trapFocus?: boolean;
  closeOnEscape?: boolean;
}

export function useOverlayBehavior({
  isOpen,
  containerRef,
  initialFocusRef,
  restoreFocusRef,
  onClose,
  trapFocus = true,
  closeOnEscape = true,
}: UseOverlayBehaviorOptions) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const trapFocusRef = useRef(trapFocus);
  const closeOnEscapeRef = useRef(closeOnEscape);

  useEffect(() => {
    onCloseRef.current = onClose;
    trapFocusRef.current = trapFocus;
    closeOnEscapeRef.current = closeOnEscape;
  }, [closeOnEscape, onClose, trapFocus]);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusOverlay = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        if (document.activeElement === initialFocusRef.current) {
          return;
        }
      }

      const firstFocusable = getFocusableElements(containerRef.current)[0];
      if (firstFocusable) {
        firstFocusable.focus();
        return;
      }

      containerRef.current?.focus();
    };

    const focusFrame = window.requestAnimationFrame(focusOverlay);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscapeRef.current && event.key === 'Escape') {
        onCloseRef.current?.();
        return;
      }

      if (!trapFocusRef.current || event.key !== 'Tab' || !containerRef.current) {
        return;
      }

      const focusable = getFocusLoopElements(containerRef.current, initialFocusRef?.current);
      if (focusable.length === 0) {
        event.preventDefault();
        containerRef.current.focus();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      // Intentionally read the ref's CURRENT value at cleanup time, not a value
      // captured at effect setup: the caller may swap restoreFocusRef.current
      // (e.g. a trigger element) while the overlay is open, and focus must return
      // to whatever the trigger is when the overlay actually closes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const restoreTarget = restoreFocusRef?.current ?? previousFocusRef.current;
      restoreTarget?.focus?.();
      previousFocusRef.current = null;
    };
  }, [containerRef, initialFocusRef, isOpen, restoreFocusRef]);
}
