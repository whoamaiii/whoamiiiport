import { useCallback, useEffect, useRef, useState } from 'react';

interface WorkflowProcessCardProps {
  readonly reducedMotion: boolean;
}

export const PROCESS_VIDEO = {
  src: '/videos/cup-coffee-process.mp4',
  poster: '/images/cup-coffee-process-poster.webp',
  type: 'video/mp4',
  width: 720,
  height: 1160,
  durationLabel: '15 sec',
} as const;

const PROCESS_STAGES = [
  { index: '01', label: 'Ordinary image' },
  { index: '02', label: 'Perceptual drift' },
  { index: '03', label: 'Living surface' },
] as const;

function PlaybackIcon({ isPlaying }: { readonly isPlaying: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      {isPlaying ? (
        <path d="M6 4.5v11M14 4.5v11" />
      ) : (
        <path d="m7 4.5 8 5.5-8 5.5z" />
      )}
    </svg>
  );
}

function DiagonalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

export function WorkflowProcessCard({ reducedMotion }: WorkflowProcessCardProps) {
  const articleRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(
    () => typeof window !== 'undefined' && typeof window.IntersectionObserver !== 'function',
  );
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const article = articleRef.current;

    if (!article || shouldLoadVideo || typeof IntersectionObserver !== 'function') {
      if (!shouldLoadVideo) setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '480px 0px', threshold: 0.01 },
    );

    observer.observe(article);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  useEffect(() => {
    const article = articleRef.current;

    if (!article || typeof IntersectionObserver !== 'function') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry?.isIntersecting && entry.intersectionRatio >= 0.24),
      { threshold: [0, 0.24, 0.65] },
    );

    observer.observe(article);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !shouldLoadVideo) return;

    if (reducedMotion || !isInView || userPaused) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    void video.play().catch(() => setIsPlaying(false));
  }, [isInView, reducedMotion, shouldLoadVideo, userPaused]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    if (video.paused) {
      setUserPaused(false);
      void video.play().catch(() => setIsPlaying(false));
      return;
    }

    setUserPaused(true);
    video.pause();
  }, [shouldLoadVideo]);

  return (
    <article
      ref={articleRef}
      data-testid="workflow-process-card"
      className="process-lab"
      aria-labelledby="workflow-process-heading"
    >
      <header className="process-lab-header">
        <span className="section-signal" aria-hidden="true" />
        <div>
          <p className="editorial-kicker">Process / {PROCESS_VIDEO.durationLabel}</p>
          <h3 id="workflow-process-heading" className="editorial-display process-lab-title">
            Coffee in motion
          </h3>
        </div>
      </header>

      <div className="process-lab-stage">
        <ol className="process-timeline" aria-label="Transformation stages">
          {PROCESS_STAGES.map((stage) => (
            <li key={stage.index}>
              <span>{stage.index} —</span>
              <strong>{stage.label}</strong>
            </li>
          ))}
        </ol>

        <figure className="process-media">
          <video
            ref={videoRef}
            data-testid="workflow-process-video"
            width={PROCESS_VIDEO.width}
            height={PROCESS_VIDEO.height}
            poster={PROCESS_VIDEO.poster}
            muted
            playsInline
            loop={!reducedMotion}
            preload={shouldLoadVideo ? 'metadata' : 'none'}
            aria-label="Coffee and cup process study"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            {shouldLoadVideo ? <source src={PROCESS_VIDEO.src} type={PROCESS_VIDEO.type} /> : null}
          </video>

          <button
            type="button"
            onClick={togglePlayback}
            disabled={!shouldLoadVideo}
            className="process-playback"
            aria-label={`${isPlaying ? 'Pause' : 'Play'} coffee process study`}
          >
            <PlaybackIcon isPlaying={isPlaying} />
          </button>

          <figcaption className="sr-only">
            A short process film in which coffee, heat, surface and colour drift into
            a tactile image.
          </figcaption>
        </figure>
      </div>

      <div className="process-lab-footer">
        <p>A small study in heat, cup, texture and colour.</p>
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!shouldLoadVideo}
          className="editorial-link process-study-link"
        >
          <span className="editorial-link-mark" aria-hidden="true" />
          <span>{isPlaying ? 'Pause the study' : 'Play the study'}</span>
          <DiagonalArrow />
        </button>
      </div>
    </article>
  );
}
