import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installMatchMediaMock } from './helpers/matchMedia';

const useInViewMock = vi.hoisted(() => vi.fn(() => true));

vi.mock('motion/react', () => ({
  motion: {
    div: ({ animate, children, initial, variants, ...props }: Record<string, unknown>) => (
      <div
        {...props}
        data-animate={String(animate)}
        data-initial={String(initial)}
        data-variants={JSON.stringify(variants)}
      >
        {children as ReactNode}
      </div>
    ),
  },
  useInView: useInViewMock,
}));

describe('StaggerContainer', () => {
  beforeEach(() => {
    vi.resetModules();
    useInViewMock.mockReturnValue(true);
  });

  it('keeps mobile fast reveal shells visible while shortening the stagger', async () => {
    installMatchMediaMock({
      '(max-width: 767px)': true,
      '(prefers-reduced-motion: reduce)': false,
    });
    const { StaggerContainer } = await import('../src/components/StaggerContainer');

    render(
      <StaggerContainer mobileFastReveal staggerDelay={0.15} delay={0.2}>
        <div>Card shell</div>
      </StaggerContainer>,
    );

    const container = screen.getByText('Card shell').parentElement;
    expect(container).toHaveAttribute('data-initial', 'hidden');
    expect(container).toHaveAttribute('data-animate', 'visible');
    expect(container?.getAttribute('data-variants')).toContain('"hidden":{"opacity":1}');
    expect(container?.getAttribute('data-variants')).toContain('"staggerChildren":0.06');
    expect(container?.getAttribute('data-variants')).toContain('"delayChildren":0');
  });
});
