import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PROCESS_VIDEO,
  WorkflowProcessCard,
} from '../src/components/WorkflowProcessCard';

describe('WorkflowProcessCard video feature', () => {
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  afterEach(() => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: originalIntersectionObserver,
    });
    vi.restoreAllMocks();
  });

  it('renders the optimized process video with explicit intrinsic dimensions', async () => {
    render(<WorkflowProcessCard reducedMotion />);

    const video = screen.getByTestId('workflow-process-video');

    expect(video).toHaveAttribute('width', String(PROCESS_VIDEO.width));
    expect(video).toHaveAttribute('height', String(PROCESS_VIDEO.height));
    expect(video).toHaveAttribute('aria-label', 'Coffee and cup process study');

    await waitFor(() => expect(video).toHaveAttribute('poster', PROCESS_VIDEO.poster));
    expect(video).toHaveAttribute('preload', 'metadata');

    const source = video.querySelector('source');
    expect(source?.getAttribute('src')).toBe(PROCESS_VIDEO.src);
    expect(source?.getAttribute('type')).toBe(PROCESS_VIDEO.type);
  });

  it('keeps a mobile-sized playback control wired to the video element', async () => {
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);

    render(<WorkflowProcessCard reducedMotion />);

    const playbackButton = screen.getByRole('button', {
      name: /^play coffee process study$/i,
    });

    expect(playbackButton).toHaveClass('process-playback');

    await waitFor(() => expect(playbackButton).not.toBeDisabled());
    fireEvent.click(playbackButton);

    expect(playSpy).toHaveBeenCalledTimes(1);
    fireEvent.play(screen.getByTestId('workflow-process-video'));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /^pause coffee process study$/i }),
      ).toBeVisible(),
    );
  });
});
