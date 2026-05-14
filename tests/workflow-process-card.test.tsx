import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkflowProcessCard } from '../src/components/WorkflowProcessCard';

describe('WorkflowProcessCard image loading', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('only assigns image URLs to the current and nearby workflow slides', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });

    render(<WorkflowProcessCard reducedMotion />);

    const firstImage = screen.getByRole('img', {
      name: /computational framework for psychedelic visual phenomena/i,
    });
    const secondImage = screen.getByRole('img', {
      name: /neon infographic of psychedelic simulation stages/i,
    });
    const thirdImage = screen.getByRole('img', {
      name: /psychedelic receptor activation and perception shift/i,
    });
    const fourthImage = screen.getByRole('img', {
      name: /neon-infused cortical activation breakdown/i,
    });

    expect(firstImage).toHaveAttribute('src', '/images/workflow/workflow-step-01-800.webp');
    expect(secondImage).toHaveAttribute('src', '/images/workflow/workflow-step-02-800.webp');
    expect(thirdImage).not.toHaveAttribute('src');
    expect(fourthImage).not.toHaveAttribute('src');

    fireEvent.click(screen.getByRole('button', { name: /next workflow step/i }));

    expect(thirdImage).toHaveAttribute('src', '/images/workflow/workflow-step-03-800.webp');
    expect(fourthImage).not.toHaveAttribute('src');
  });
});
