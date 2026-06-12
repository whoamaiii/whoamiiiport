import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('InteractiveArtworkCard image contracts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('does not compute an unused modal srcset for video artworks', async () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
      '(min-width: 1024px)': false,
    });
    const getModalSrcset = vi.fn(() => '/images/hand-portal-video-poster-modal-1600.webp 1600w');

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
        imageSlug="hand-portal-video-poster"
        videoSrc="/videos/hand-portal-study.mp4"
        title={{ primary: 'Hand Portal' }}
        sections={[{ body: 'Video notes.' }]}
      />,
    );

    expect(screen.getByRole('button', { name: /view hand portal video details and notes/i })).toBeInTheDocument();
    expect(getModalSrcset).not.toHaveBeenCalled();
  });

  it('marks Norwegian artwork notes with a lang attribute for assistive tech', async () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
      '(min-width: 1024px)': true,
      '(max-width: 767px)': false,
    });
    const { default: InteractiveArtworkCard } = await import('../src/components/InteractiveArtworkCard');

    render(
      <InteractiveArtworkCard
        imageSlug="mushroom-offering"
        title={{ primary: 'Mushroom Offering' }}
        sections={[{ heading: 'Mening', body: 'Norsk beskrivelse av verket.' }]}
        sectionsLang="no"
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /view mushroom offering artwork details and notes/i }),
    );

    const noteBody = await screen.findByText('Norsk beskrivelse av verket.');
    expect(noteBody.closest('[lang]')).toHaveAttribute('lang', 'no');
  });

  it('keeps gallery card images lazy by default', async () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
      '(min-width: 1024px)': false,
    });
    const { default: InteractiveArtworkCard } = await import('../src/components/InteractiveArtworkCard');

    render(
      <InteractiveArtworkCard
        imageSlug="liquid-perception"
        title={{ primary: 'Liquid Perception' }}
        sections={[{ body: 'Image notes.' }]}
      />,
    );

    const image = screen.getByRole('img', {
      name: /modified selfie portrait/i,
    });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('fetchpriority', 'auto');
  });

  it('can prioritize the first gallery card image without changing the component default', async () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
      '(min-width: 1024px)': false,
    });
    const { default: InteractiveArtworkCard } = await import('../src/components/InteractiveArtworkCard');

    render(
      <InteractiveArtworkCard
        imageSlug="liquid-perception"
        title={{ primary: 'Liquid Perception' }}
        sections={[{ body: 'Image notes.' }]}
        imageLoading="eager"
        imageFetchPriority="auto"
      />,
    );

    const image = screen.getByRole('img', {
      name: /modified selfie portrait/i,
    });
    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('fetchpriority', 'auto');
  });

  it('uses a sharper mobile priority candidate immediately, then upgrades the first eager gallery image', async () => {
    vi.useFakeTimers();
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
      '(min-width: 1024px)': false,
      '(max-width: 767px)': true,
    });

    const { default: InteractiveArtworkCard } = await import('../src/components/InteractiveArtworkCard');

    render(
      <InteractiveArtworkCard
        imageSlug="liquid-perception"
        title={{ primary: 'Liquid Perception' }}
        sections={[{ body: 'Image notes.' }]}
        imageLoading="eager"
        imageFetchPriority="auto"
      />,
    );

    const image = screen.getByRole('img', {
      name: /modified selfie portrait/i,
    });
    expect(image).toHaveAttribute('src', '/images/liquid-perception-560.webp');
    expect(image).not.toHaveAttribute('srcset');

    act(() => {
      fireEvent.load(image);
    });

    act(() => {
      vi.advanceTimersByTime(140);
    });

    expect(image).toHaveAttribute('src', '/images/liquid-perception-800.webp');
    expect(image).toHaveAttribute('srcset', expect.stringContaining('/images/liquid-perception-1024.webp 1024w'));
  });

  it('withholds lower-priority gallery image requests until the card nears the viewport', async () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
      '(min-width: 1024px)': false,
      '(max-width: 767px)': true,
    });

    let observerCallback: IntersectionObserverCallback | undefined;

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        readonly root = null;
        readonly rootMargin = '160px 0px';
        readonly thresholds = [0.01];

        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback;
        }

        disconnect = vi.fn();
        observe = vi.fn();
        takeRecords = vi.fn(() => []);
        unobserve = vi.fn();
      },
    );

    const { default: InteractiveArtworkCard } = await import('../src/components/InteractiveArtworkCard');

    render(
      <InteractiveArtworkCard
        imageSlug="mycelial-hand"
        title={{ primary: 'Mycelial Hand' }}
        sections={[{ body: 'Image notes.' }]}
        deferImageUntilVisible
      />,
    );

    const image = screen.getByRole('img', {
      name: /hand with mushrooms/i,
    });
    expect(image).not.toHaveAttribute('src');
    expect(image).not.toHaveAttribute('srcset');

    act(() => {
      observerCallback?.(
        [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/images/mycelial-hand-800.webp');
      expect(image).toHaveAttribute('srcset');
    });
  });
});
