import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkflowProcessCard } from '../src/components/WorkflowProcessCard';

describe('WorkflowProcessCard image loading', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('only assigns image URLs and alt text to the current and nearby workflow slides', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });

    const { container } = render(<WorkflowProcessCard reducedMotion />);

    // Carousel slides render in step order; scope to them so unloaded slides
    // (which intentionally drop both src and alt) can still be located.
    const slideImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('section[aria-label^="Step "] img'),
    );

    const [firstImage, secondImage, thirdImage, fourthImage, fifthImage] = slideImages;

    // Loaded slides expose their real src and descriptive alt...
    expect(firstImage).toHaveAttribute('src', '/images/workflow/workflow-step-01-800.webp');
    expect(firstImage).toHaveAttribute('alt', expect.stringMatching(/computational framework/i));
    expect(secondImage).toHaveAttribute('src', '/images/workflow/workflow-step-02-800.webp');

    // ...while far slides drop both, so AT does not announce phantom imageless nodes.
    expect(thirdImage).not.toHaveAttribute('src');
    expect(thirdImage).toHaveAttribute('alt', '');
    expect(fourthImage).not.toHaveAttribute('src');
    expect(fourthImage).toHaveAttribute('alt', '');

    fireEvent.click(container.querySelector('[aria-label="Next workflow step"]')!);

    expect(thirdImage).toHaveAttribute('src', '/images/workflow/workflow-step-03-800.webp');
    expect(thirdImage).toHaveAttribute('alt', expect.stringMatching(/receptor activation/i));
    expect(fourthImage).not.toHaveAttribute('src');
    expect(fourthImage).toHaveAttribute('alt', '');

    fireEvent.click(
      container.querySelector(
        '[aria-label="Go to workflow chapter 2, Perception, starting at step 4"]',
      )!,
    );

    expect(firstImage).not.toHaveAttribute('src');
    expect(firstImage).toHaveAttribute('alt', '');
    expect(secondImage).not.toHaveAttribute('src');
    expect(thirdImage).toHaveAttribute('src', '/images/workflow/workflow-step-03-800.webp');
    expect(fourthImage).toHaveAttribute('src', '/images/workflow/workflow-step-04-800.webp');
    expect(fifthImage).toHaveAttribute('src', '/images/workflow/workflow-step-05-800.webp');
  });

  it('uses five chapter controls with mobile-sized hit areas', () => {
    const { container } = render(<WorkflowProcessCard reducedMotion />);
    const chapterControls = Array.from(
      container.querySelectorAll<HTMLButtonElement>('[aria-label^="Go to workflow chapter"]'),
    );

    expect(chapterControls).toHaveLength(5);
    chapterControls.forEach((control) => {
      expect(control).toHaveClass('h-11', 'w-11');
    });
  });
});
