import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MagneticButton } from '../src/components/MagneticButton';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('MagneticButton', () => {
  it('renders a real button when used as an action', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
    });

    render(<MagneticButton onClick={() => undefined}>Click me</MagneticButton>);

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders a link when href is provided', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
    });

    render(<MagneticButton href="#contact">Go contact</MagneticButton>);

    expect(screen.getByRole('link', { name: /go contact/i })).toHaveAttribute('href', '#contact');
  });

  it('applies link display classes to the anchor element', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
    });

    render(
      <MagneticButton href="#contact" className="hidden md:block rounded-full">
        Go contact
      </MagneticButton>,
    );

    expect(screen.getByRole('link', { name: /go contact/i })).toHaveClass(
      'hidden',
      'md:block',
      'rounded-full',
    );
  });

  it('supports accessible icon-only links without rendering a nested button', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
    });

    render(
      <MagneticButton
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        ariaLabel="Instagram"
      >
        <span aria-hidden="true">I</span>
      </MagneticButton>,
    );

    const link = screen.getByRole('link', { name: /instagram/i });

    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.queryByRole('button', { name: /instagram/i })).not.toBeInTheDocument();
  });
});
