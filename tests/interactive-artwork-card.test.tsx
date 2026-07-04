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
    const getModalSrcset = vi.fn(() => '/images/corridor-master-poster-modal-1600.webp 1600w');

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
        imageSlug="corridor-master-poster"
        videoSrc="/videos/corridor-master.mp4"
        title={{ primary: 'Korridormaster' }}
        sections={[{ body: 'Video notes.' }]}
      />,
    );

    expect(screen.getByRole('button', { name: /se korridormaster video med notater/i })).toBeInTheDocument();
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
        title={{ primary: 'Soppoffer' }}
        sections={[{ heading: 'Mening', body: 'Norsk beskrivelse av verket.' }]}
        sectionsLang="no"
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /se soppoffer verk med notater/i }),
    );

    const noteBody = await screen.findByText('Norsk beskrivelse av verket.');
    expect(noteBody.closest('[lang]')).toHaveAttribute('lang', 'no');
  });

  it('opens and closes an artwork modal inside the shared motion feature provider', async () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
      '(min-width: 1024px)': false,
      '(max-width: 767px)': true,
    });
    const [{ default: InteractiveArtworkCard }, { MotionFeatureProvider }] = await Promise.all([
      import('../src/components/InteractiveArtworkCard'),
      import('../src/components/motion/MotionFeatureProvider'),
    ]);

    render(
      <MotionFeatureProvider>
        <InteractiveArtworkCard
          imageSlug="mushroom-offering"
          title={{ primary: 'Soppoffer' }}
          sections={[{ body: 'Image notes.' }]}
        />
      </MotionFeatureProvider>,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /se soppoffer verk med notater/i }),
    );

    const dialog = await screen.findByRole('dialog', {
      name: /soppoffer verkdetaljer/i,
    });
    expect(dialog).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /lukk modal/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /soppoffer verkdetaljer/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('moves focus into the mobile info panel and back to the toggle', async () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
      '(min-width: 1024px)': false,
      '(max-width: 767px)': true,
    });
    const { default: InteractiveArtworkCard } = await import('../src/components/InteractiveArtworkCard');

    render(
      <InteractiveArtworkCard
        imageSlug="mushroom-offering"
        title={{ primary: 'Soppoffer' }}
        sections={[{ body: 'Image notes.' }]}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /se soppoffer verk med notater/i }),
    );

    const showInfoButton = await screen.findByRole('button', {
      name: /les mening \+ prosess/i,
    });
    fireEvent.click(showInfoButton);

    const infoPanel = document.getElementById('artwork-info-panel-mushroom-offering');
    expect(infoPanel).not.toBeNull();
    await waitFor(() => expect(infoPanel).toHaveFocus());

    const hideInfoButton = screen.getByRole('button', { name: /skjul notater/i });
    expect(hideInfoButton).toHaveAttribute(
      'aria-controls',
      'artwork-info-panel-mushroom-offering',
    );
    fireEvent.click(hideInfoButton);

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /les mening \+ prosess/i }),
      ).toHaveFocus(),
    );
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
      name: /modifisert selvportrett/i,
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
      name: /modifisert selvportrett/i,
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
      name: /modifisert selvportrett/i,
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

    const { container } = render(
      <InteractiveArtworkCard
        imageSlug="mycelial-hand"
        title={{ primary: 'Mycelhånd' }}
        sections={[{ body: 'Image notes.' }]}
        deferImageUntilVisible
      />,
    );

    // Located structurally rather than by accessible name: a deferred slide drops
    // its alt so AT does not announce a phantom imageless node before it loads.
    const image = container.querySelector('img');
    expect(image).not.toBeNull();
    expect(image).not.toHaveAttribute('src');
    expect(image).not.toHaveAttribute('srcset');
    expect(image).toHaveAttribute('alt', '');

    act(() => {
      observerCallback?.(
        [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/images/mycelial-hand-800.webp');
      expect(image).toHaveAttribute('srcset');
      expect(image).toHaveAttribute('alt', expect.stringMatching(/magisk hånd/i));
    });
  });
});
