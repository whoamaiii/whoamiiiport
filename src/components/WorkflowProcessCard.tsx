import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface WorkflowProcessCardProps {
  reducedMotion: boolean;
}

export const PROCESS_VIDEO = {
  src: '/videos/cup-coffee-process.mp4',
  poster: '/images/cup-coffee-process-poster.webp',
  type: 'video/mp4',
  width: 720,
  height: 1160,
  durationLabel: '15 sec',
} as const;

export function WorkflowProcessCard({ reducedMotion }: WorkflowProcessCardProps) {
  const articleRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const article = articleRef.current;

    if (!article || typeof window.IntersectionObserver !== 'function') {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '640px 0px', threshold: 0.01 },
    );

    observer.observe(article);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !shouldLoadVideo) {
      return;
    }

    if (reducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    void video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [reducedMotion, shouldLoadVideo]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video || !shouldLoadVideo) {
      return;
    }

    if (video.paused) {
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      return;
    }

    video.pause();
    setIsPlaying(false);
  }, [shouldLoadVideo]);

  return (
    <article
      ref={articleRef}
      data-testid="workflow-process-card"
      className="relative mx-auto mt-14 max-w-5xl overflow-hidden rounded-[1.45rem] border border-white/12 bg-black/54 shadow-[0_24px_90px_-52px_rgba(34,211,238,0.54)] backdrop-blur-2xl sm:mt-[4.5rem] sm:rounded-[1.65rem]"
      aria-labelledby="workflow-process-heading"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
      <div className="absolute -top-24 right-[-22%] h-56 w-56 rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="workflow-warm-bloom absolute -bottom-28 left-[-18%] h-60 w-60 rounded-full blur-3xl" />

      <div className="relative grid gap-5 px-4 pb-5 pt-4 sm:px-6 sm:pb-7 sm:pt-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(18rem,0.58fr)] lg:items-end lg:gap-8 lg:px-8">
        <figure className="relative overflow-hidden rounded-[1.05rem] border border-white/10 bg-zinc-950/72 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:rounded-[1.15rem] sm:p-3">
          <div className="relative mx-auto aspect-[18/29] max-h-[72dvh] min-h-[26rem] overflow-hidden rounded-[0.85rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))] sm:min-h-[34rem]">
            <video
              ref={videoRef}
              data-testid="workflow-process-video"
              width={PROCESS_VIDEO.width}
              height={PROCESS_VIDEO.height}
              poster={shouldLoadVideo ? PROCESS_VIDEO.poster : undefined}
              muted
              playsInline
              autoPlay={!reducedMotion && shouldLoadVideo}
              loop={!reducedMotion}
              preload={shouldLoadVideo ? 'metadata' : 'none'}
              aria-label="Cup coffee process video"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="h-full w-full object-cover"
            >
              {shouldLoadVideo ? (
                <source src={PROCESS_VIDEO.src} type={PROCESS_VIDEO.type} />
              ) : null}
            </video>

            {!shouldLoadVideo ? (
              <div
                className="absolute inset-0 grid place-items-center bg-zinc-950/70 text-center text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cyan-100/70"
                aria-hidden="true"
              >
                Loading film
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950/82 via-zinc-950/24 to-transparent" />

            <button
              type="button"
              onClick={togglePlayback}
              disabled={!shouldLoadVideo}
              className="absolute bottom-3 right-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-zinc-950/58 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl transition hover:bg-white/14 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:pointer-events-none disabled:opacity-45"
              aria-label={`${isPlaying ? 'Pause' : 'Play'} cup coffee process video`}
            >
              {isPlaying ? (
                <Pause size={18} aria-hidden="true" />
              ) : (
                <Play size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          <figcaption className="sr-only">
            A portrait process video made by Quentin, presented as a moving study in the
            selected works section.
          </figcaption>
        </figure>

        <div className="grid gap-4 pb-1 lg:pb-5">
          <div>
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-cyan-200/75">
              Art process
            </p>
            <h3
              id="workflow-process-heading"
              className="max-w-[11ch] text-3xl font-black uppercase italic leading-[0.88] text-white sm:max-w-[12ch] sm:text-5xl"
            >
              Coffee in motion
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-200/22 bg-cyan-200/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.26em] text-cyan-50">
              Process film
            </span>
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold tabular-nums text-zinc-100">
              {PROCESS_VIDEO.durationLabel}
            </span>
          </div>

          <p className="max-w-[29ch] text-base leading-7 text-zinc-300/92 sm:text-lg sm:leading-8">
            A small moving study of heat, cup, surface, and color turning into a
            tactile image fragment. It keeps the process section visual first, closer to
            the way the work actually feels.
          </p>
        </div>
      </div>
    </article>
  );
}
