import { useLayoutEffect, type RefObject } from 'react';
import { LiquidGlassIconButton } from '@ogtirth/liquid-glass-oss';
import { Menu, X } from 'lucide-react';
import {
  MOBILE_MENU_GLASS_BACKGROUND,
  MOBILE_MENU_GLASS_SETTINGS,
  useWebGlSupport,
} from './mobileMenuGlass';

interface MobileMenuButtonProps {
  readonly isOpen: boolean;
  readonly onClick: () => void;
  readonly buttonRef: RefObject<HTMLButtonElement | null>;
}

function syncMenuTriggerState(trigger: HTMLButtonElement, isOpen: boolean) {
  trigger.setAttribute('aria-expanded', String(isOpen));
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.dataset.open = String(isOpen);
  trigger.removeAttribute('aria-pressed');

  if (isOpen) {
    trigger.setAttribute('aria-controls', 'mobile-menu');
    trigger.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('tabindex', '-1');
  } else {
    trigger.removeAttribute('aria-controls');
    trigger.removeAttribute('aria-hidden');
    trigger.removeAttribute('tabindex');
  }
}

export function MobileMenuButton({
  isOpen,
  onClick,
  buttonRef,
}: MobileMenuButtonProps) {
  const supportsWebGl = useWebGlSupport();
  const triggerLabel = isOpen ? 'Lukk navigasjonsmeny' : 'Åpne meny';
  const triggerControls = isOpen ? 'mobile-menu' : undefined;

  useLayoutEffect(() => {
    const trigger = document.querySelector('button.site-header-menu-trigger');

    if (!(trigger instanceof HTMLButtonElement)) {
      return;
    }

    buttonRef.current = trigger;

    return () => {
      if (buttonRef.current === trigger) {
        buttonRef.current = null;
      }
    };
  }, [buttonRef, supportsWebGl]);

  useLayoutEffect(() => {
    const trigger = buttonRef.current;

    if (!trigger) {
      return;
    }

    syncMenuTriggerState(trigger, isOpen);
  }, [buttonRef, isOpen, supportsWebGl]);

  const icon = isOpen ? (
    <X className="site-header-menu-trigger-icon" size={30} strokeWidth={1.8} aria-hidden="true" />
  ) : (
    <Menu className="site-header-menu-trigger-icon" size={30} strokeWidth={1.8} aria-hidden="true" />
  );
  const triggerClassName = `site-header-menu-trigger ${
    isOpen ? 'site-header-menu-trigger--overlay-open' : ''
  } focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200`.trim();

  if (supportsWebGl === true) {
    return (
      <LiquidGlassIconButton
        active={isOpen}
        backgroundImage={MOBILE_MENU_GLASS_BACKGROUND}
        className={triggerClassName}
        aria-label={triggerLabel}
        aria-hidden={isOpen || undefined}
        onActiveChange={() => onClick()}
        shape="squircle"
        settings={MOBILE_MENU_GLASS_SETTINGS}
        variant="dark"
      >
        {icon}
      </LiquidGlassIconButton>
    );
  }

  return (
    <button
      type="button"
      className={`${triggerClassName} site-header-menu-trigger--fallback`.trim()}
      aria-label={triggerLabel}
      aria-hidden={isOpen || undefined}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      aria-controls={triggerControls}
      tabIndex={isOpen ? -1 : undefined}
      data-open={String(isOpen)}
      onClick={onClick}
    >
      <span className="site-header-menu-trigger-fallback-sheen" aria-hidden="true" />
      {icon}
    </button>
  );
}
