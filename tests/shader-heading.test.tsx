import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShaderHeading } from '../src/components/ShaderHeading';
import { installMatchMediaMock } from './helpers/matchMedia';

// Replace the per-word shader lifecycle with a button that fires `onReady` on
// demand, so a test can control exactly which lines have reported readiness.
vi.mock('../src/components/shared/ShaderTextWord', () => ({
  ShaderTextWord: ({ text, onReady }: { text: string; onReady?: () => void }) => (
    <button type="button" data-testid={`ready-${text}`} onClick={() => onReady?.()}>
      {text}
    </button>
  ),
}));

describe('ShaderHeading', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fires onReady only after every visual line reports ready', async () => {
    installMatchMediaMock({ '(max-width: 767px)': false });

    const onReady = vi.fn();
    render(
      <ShaderHeading onReady={onReady} visualLines={['One', 'Two', 'Three']}>
        One Two Three
      </ShaderHeading>,
    );

    expect(onReady).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('ready-One'));
    expect(onReady).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('ready-Two'));
    expect(onReady).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('ready-Three'));
    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1);
    });
  });

  it('fires onReady once for a single-line heading', async () => {
    installMatchMediaMock({ '(max-width: 767px)': false });

    const onReady = vi.fn();
    render(<ShaderHeading onReady={onReady}>Solo</ShaderHeading>);

    expect(onReady).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('ready-Solo'));
    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1);
    });
  });
});
