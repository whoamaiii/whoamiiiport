import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import {
  WORKFLOW_STEPS,
  getWorkflowImageUrl,
  getWorkflowSrcset,
} from '../content/workflowSteps';
import { useOverlayBehavior } from '../hooks/useOverlayBehavior';

interface WorkflowProcessCardProps {
  reducedMotion: boolean;
}

export function WorkflowProcessCard({ reducedMotion }: WorkflowProcessCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const stepCount = WORKFLOW_STEPS.length;
  const modalStep = modalIndex === null ? null : WORKFLOW_STEPS[modalIndex];
  const currentModalIndex = modalIndex ?? 0;
  const modalTitleId = 'workflow-step-modal-title';

  const scrollToStep = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) {
        return;
      }

      const nextIndex = Math.min(Math.max(index, 0), stepCount - 1);
      container.scrollTo({
        left: container.clientWidth * nextIndex,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
      setActiveIndex(nextIndex);
    },
    [reducedMotion, stepCount],
  );

  const openStepDetails = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setModalIndex(index);
    scrollToStep(index);
  };

  const showModalStep = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), stepCount - 1);
    setModalIndex(nextIndex);
    scrollToStep(nextIndex);
  };

  useOverlayBehavior({
    isOpen: modalIndex !== null,
    containerRef: modalRef,
    initialFocusRef: closeButtonRef,
    restoreFocusRef: triggerRef,
    onClose: () => setModalIndex(null),
  });

  useEffect(() => {
    if (modalIndex !== null) {
      infoPanelRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [modalIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    let frameId = 0;
    const updateActiveStep = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const nextIndex = Math.round(container.scrollLeft / Math.max(container.clientWidth, 1));
        const clampedIndex = Math.min(Math.max(nextIndex, 0), stepCount - 1);
        setActiveIndex(clampedIndex);
      });
    };

    container.addEventListener('scroll', updateActiveStep, { passive: true });
    window.addEventListener('resize', updateActiveStep);
    updateActiveStep();

    return () => {
      window.cancelAnimationFrame(frameId);
      container.removeEventListener('scroll', updateActiveStep);
      window.removeEventListener('resize', updateActiveStep);
    };
  }, [stepCount]);

  return (
    <article
      className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-[1.65rem] border border-white/12 bg-black/48 shadow-[0_24px_90px_-52px_rgba(217,70,239,0.72)] backdrop-blur-2xl"
      aria-labelledby="workflow-process-heading"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/70 to-transparent" />
      <div className="absolute -top-24 right-[-22%] h-56 w-56 rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="absolute -bottom-28 left-[-18%] h-60 w-60 rounded-full bg-fuchsia-500/16 blur-3xl" />

      <div className="relative px-4 pb-5 pt-4 sm:px-6 sm:pb-7 sm:pt-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
          <div className="min-w-0">
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-cyan-200/75">
              Art process
            </p>
            <h3
              id="workflow-process-heading"
              className="max-w-[12ch] text-3xl font-black uppercase italic leading-[0.88] text-white sm:max-w-none sm:text-5xl"
            >
              Science into image
            </h3>
          </div>

          <div className="shrink-0 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-semibold tabular-nums text-zinc-100">
            {String(activeIndex + 1).padStart(2, '0')} / {String(stepCount).padStart(2, '0')}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth rounded-[1.15rem] border border-white/10 bg-zinc-950/72 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Science and art workflow steps"
        >
          {WORKFLOW_STEPS.map((step, index) => (
            <section
              key={step.id}
              className="grid min-w-full snap-center grid-rows-[minmax(0,1fr)_auto] bg-black/28"
              aria-label={`Step ${index + 1}: ${step.title}`}
            >
              <button
                type="button"
                onClick={(event) => openStepDetails(index, event.currentTarget)}
                className="group/workflow-image flex min-h-[21rem] items-center justify-center border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))] p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-zinc-950 sm:min-h-[34rem] sm:p-4 lg:min-h-[42rem]"
                aria-label={`Open larger view and notes for step ${index + 1}: ${step.title}`}
              >
                {(() => {
                  const shouldLoadImage = Math.abs(index - activeIndex) <= 1;

                  return (
                    <img
                      src={shouldLoadImage ? getWorkflowImageUrl(index + 1, 800) : undefined}
                      srcSet={shouldLoadImage ? getWorkflowSrcset(index + 1) : undefined}
                      sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1200px) 70vw, 58rem"
                      alt={step.alt}
                      width={index === 0 ? 1200 : 800}
                      height={index === 0 ? 800 : 1422}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'auto' : 'low'}
                      decoding="async"
                      className={`max-h-[20rem] w-full object-contain drop-shadow-[0_22px_38px_rgba(0,0,0,0.48)] transition duration-300 group-hover/workflow-image:scale-[1.015] group-focus-visible/workflow-image:scale-[1.015] sm:max-h-[32rem] lg:max-h-[40rem] ${
                        shouldLoadImage ? 'opacity-100' : 'opacity-0'
                      }`.trim()}
                    />
                  );
                })()}
              </button>

              <div className="grid gap-3 px-4 py-4 sm:grid-cols-[auto_1fr] sm:items-start sm:px-5 sm:py-5">
                <p className="w-fit rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.26em] text-fuchsia-100">
                  Step {String(index + 1).padStart(2, '0')}
                </p>
                <div>
                  <h4 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                    {step.title}
                  </h4>
                  <p className="mt-2 max-w-[56ch] text-sm leading-6 text-zinc-300/90">
                    {step.description}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => scrollToStep(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/14 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
            aria-label="Previous workflow step"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <div className="flex max-w-[11rem] flex-wrap justify-center gap-1.5" aria-label="Workflow step position">
            {WORKFLOW_STEPS.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => scrollToStep(index)}
                className={`h-2 rounded-full transition-all active:scale-95 ${
                  activeIndex === index ? 'w-6 bg-cyan-200' : 'w-2 bg-white/28 hover:bg-white/50'
                }`}
                aria-label={`Go to workflow step ${index + 1}: ${step.title}`}
                aria-current={activeIndex === index ? 'step' : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToStep(activeIndex + 1)}
            disabled={activeIndex === stepCount - 1}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/14 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
            aria-label="Next workflow step"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          modalStep ? (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-0 backdrop-blur-xl sm:p-5">
              <button
                type="button"
                className="absolute inset-0 cursor-pointer"
                onClick={() => setModalIndex(null)}
                aria-hidden="true"
                tabIndex={-1}
                aria-label="Close workflow step details"
              />
              <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={modalTitleId}
                tabIndex={-1}
                className="relative grid h-[100dvh] max-h-[100dvh] w-full max-w-7xl gap-4 overflow-hidden rounded-none border-0 bg-zinc-950/92 p-3 shadow-[0_30px_120px_-50px_rgba(34,211,238,0.58)] outline-none sm:max-h-[92vh] sm:rounded-[1.4rem] sm:border sm:border-white/12 sm:p-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]"
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setModalIndex(null)}
                  className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-zinc-100 transition hover:bg-white/16 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  aria-label="Close workflow step details"
                >
                  <X size={20} aria-hidden="true" />
                </button>

                <div className="flex min-h-0 items-center justify-center rounded-[1rem] border border-white/10 bg-black/50 p-2 sm:p-4">
                  <img
                    src={getWorkflowImageUrl(currentModalIndex + 1, 1200)}
                    srcSet={getWorkflowSrcset(currentModalIndex + 1)}
                    sizes="(max-width: 1024px) calc(100vw - 3rem), 64vw"
                    alt={modalStep.alt}
                    width={currentModalIndex === 0 ? 1200 : 800}
                    height={currentModalIndex === 0 ? 800 : 1422}
                    decoding="async"
                    className="max-h-[44vh] w-full object-contain lg:max-h-[84vh]"
                  />
                </div>

                <div
                  ref={infoPanelRef}
                  className="min-h-0 overflow-y-auto rounded-[1rem] border border-white/10 bg-white/[0.045] p-5 custom-scrollbar sm:p-6"
                >
                  <p className="mb-3 w-fit rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.26em] text-fuchsia-100">
                    Step {String(currentModalIndex + 1).padStart(2, '0')} of {String(stepCount).padStart(2, '0')}
                  </p>
                  <h3 id={modalTitleId} className="text-3xl font-black uppercase italic leading-none text-white sm:text-4xl">
                    {modalStep.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-zinc-300">
                    {modalStep.description}
                  </p>

                  <div className="my-6 h-px w-16 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-transparent" />

                  <div className="space-y-6">
                    {modalStep.detailSections.map((section) => (
                      <section key={section.heading}>
                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                          {section.heading}
                        </h4>
                        <p className="text-sm leading-7 text-zinc-300/92">
                          {section.body}
                        </p>
                      </section>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => showModalStep(currentModalIndex - 1)}
                      disabled={currentModalIndex === 0}
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/14 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35"
                    >
                      <ArrowLeft size={16} aria-hidden="true" />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => showModalStep(currentModalIndex + 1)}
                      disabled={currentModalIndex === stepCount - 1}
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/14 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35"
                    >
                      Next
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null,
          document.body,
        )}
    </article>
  );
}
