import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('InteractiveArtworkCard image contracts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('does not compute an unused modal srcset for video artworks', async () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
      '(min-width: 1024px)': false,
    });
    const getModalSrcset = vi.fn(() => '/images/ferdigcop-video-poster-modal-1600.webp 1600w');

    vi.doMock('../src/utils/images', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../src/utils/images')>();
      return {
        ...actual,
        getModalSrcset,
      };
    });

    const { default: InteractiveArtworkCard } = await import('../src/components/InteractiveArtworkCard');

    render(
      <InteractiveArtworkCard
        imageSlug="ferdigcop-video-poster"
        videoSrc="/videos/ferdigcop-gallery.mp4"
        title={{ primary: 'Ferdigcop' }}
        sections={[{ body: 'Video notes.' }]}
      />,
    );

    expect(screen.getByRole('button', { name: /view ferdigcop video details and notes/i })).toBeInTheDocument();
    expect(getModalSrcset).not.toHaveBeenCalled();
  });
});
