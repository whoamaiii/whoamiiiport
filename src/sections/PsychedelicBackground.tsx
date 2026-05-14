import { motion, type MotionValue } from 'motion/react';

interface PsychedelicBackgroundProps {
  blobX1: MotionValue<number>;
  blobY1: MotionValue<number>;
  blobX2: MotionValue<number>;
  blobY2: MotionValue<number>;
  blobX3: MotionValue<number>;
  blobY3: MotionValue<number>;
  interactive: boolean;
}

export function PsychedelicBackground({
  blobX1,
  blobY1,
  blobX2,
  blobY2,
  blobX3,
  blobY3,
  interactive,
}: PsychedelicBackgroundProps) {
  const containerClassName = interactive
    ? 'fixed inset-0 overflow-hidden pointer-events-none z-[5] mix-blend-screen opacity-[0.24]'
    : 'fixed inset-0 overflow-hidden pointer-events-none z-[5] opacity-[0.18]';

  return (
    <div className={containerClassName}>
      {interactive ? (
        <>
          <motion.div
            className="absolute top-[-10%] left-[-10%] h-[40vw] w-[40vw] rounded-full bg-indigo-500/70 mix-blend-normal blur-[110px] animate-blob"
            style={{ x: blobX1, y: blobY1 }}
          />
          <motion.div
            className="absolute top-[20%] right-[-10%] h-[35vw] w-[35vw] rounded-full bg-emerald-400/60 mix-blend-normal blur-[112px] animate-blob animation-delay-2000"
            style={{ x: blobX2, y: blobY2 }}
          />
          <motion.div
            className="absolute bottom-[-20%] left-[20%] h-[45vw] w-[45vw] rounded-full bg-cyan-500/40 mix-blend-normal blur-[120px] animate-blob animation-delay-4000"
            style={{ x: blobX3, y: blobY3 }}
          />
        </>
      ) : (
        <>
          <div className="absolute top-[-8%] left-[-8%] h-[42vw] w-[42vw] rounded-full bg-indigo-500/42 blur-[118px]" />
          <div className="absolute top-[18%] right-[-10%] h-[34vw] w-[34vw] rounded-full bg-emerald-400/36 blur-[112px]" />
          <div className="absolute bottom-[-18%] left-[18%] h-[44vw] w-[44vw] rounded-full bg-cyan-500/28 blur-[126px]" />
        </>
      )}
    </div>
  );
}
