interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  detailSections: readonly {
    heading: string;
    body: string;
  }[];
  alt: string;
}

export const WORKFLOW_IMAGE_FILE_WIDTHS = [480, 800, 1200] as const;

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'computational-framework',
    title: 'Computational framework',
    description:
      'The whole system at once: neurobiology, math, simulation, and image-making mapped as one visual workflow.',
    detailSections: [
      {
        heading: 'What this step is doing',
        body:
          'This is the overview board for the whole workflow. It treats psychedelic visuals as a system instead of decoration: receptor changes, visual cortex dynamics, geometric pattern rules, rendering choices, and final image polish all belong to the same chain.',
      },
      {
        heading: 'Why it matters for the art',
        body:
          'The point is to make the work feel grounded. The visuals can still be wild, neon, and overwhelming, but they are not random effects sprayed over an image. They are built from an idea of how perception gets amplified, organized, bent, and finally translated into a visual object.',
      },
    ],
    alt: 'Computational framework for psychedelic visual phenomena',
  },
  {
    id: 'simulation-stages',
    title: 'Simulation stages',
    description:
      'A staged pipeline showing how raw biological signals become structured psychedelic image behavior.',
    detailSections: [
      {
        heading: 'From receptor to visible simulation',
        body:
          'This step lays out the engine: 5-HT2A receptor activity changes visual gain and timing, V1 dynamics turn that changed signal into pattern behavior, and post-FX makes the invisible mechanics visible. The image text says the important thing plainly: this is not generic trippy decor, it is a cause chain.',
      },
      {
        heading: 'Portfolio meaning',
        body:
          'For the portfolio, this explains why the workflow can sit between science and image-making. The art is not claiming to be a medical diagram. It is using neuroscience and perception theory as a scaffolding for making visuals that feel internally consistent.',
      },
    ],
    alt: 'Neon infographic of psychedelic simulation stages',
  },
  {
    id: 'receptor-activation',
    title: 'Receptor activation',
    description:
      'The starting point: chemical and receptor-level changes that shift how perception begins to organize itself.',
    detailSections: [
      {
        heading: 'Signal enters the system',
        body:
          'The receptor layer is the starting gate. In the workflow, 5-HT2A activation is treated as the event that changes how much signal gets through, how strongly visual material is amplified, and how stable the ordinary image of the world feels.',
      },
      {
        heading: 'Art translation',
        body:
          'In the images, this becomes the reason edges brighten, textures wake up, and ordinary surfaces begin to feel over-informed. The artwork does not need to show molecules literally; it can show the perceptual consequence: too much signal arriving with too much intensity.',
      },
    ],
    alt: 'Psychedelic receptor activation and perception shift',
  },
  {
    id: 'cortical-activation',
    title: 'Cortical activation',
    description:
      'A breakdown of how visual cortex activity can move from ordinary signal flow into intensified pattern pressure.',
    detailSections: [
      {
        heading: 'Cortex as pressure field',
        body:
          'This step moves from chemistry into the visual system. The visual cortex is treated like an active field, not a passive camera. When gain and timing change, the field can start producing pressure, rhythm, and repeated structure.',
      },
      {
        heading: 'What shows up visually',
        body:
          'That is why the portfolio imagery can use contour doubling, vibrating outlines, dense tiling, and glowing seams. Those marks read like perception trying to lock onto the world while the signal is being pushed harder than usual.',
      },
    ],
    alt: 'Neon-infused cortical activation breakdown',
  },
  {
    id: 'neural-dynamics',
    title: 'Neural dynamics',
    description:
      'The feedback layer where waves, inhibition, excitation, and timing start shaping visible forms.',
    detailSections: [
      {
        heading: 'Pattern mechanics',
        body:
          'Neural dynamics are the motion rules under the picture. Excitation, inhibition, feedback, and timing can be imagined as waves passing through a field. Those waves do not stay abstract; they start selecting what kinds of shapes can appear.',
      },
      {
        heading: 'Why it helps the workflow',
        body:
          'This gives the artwork a logic for repetition. Spirals, pulses, lattices, and rippling bands are not just cool shapes. They become artifacts of a system where the visual field is trying to stabilize while being continuously disturbed.',
      },
    ],
    alt: 'Neural dynamics and pattern formation',
  },
  {
    id: 'spatial-perception',
    title: 'Spatial perception',
    description:
      'A geometry study for the warped feeling of depth, scale, and space inside altered visual states.',
    detailSections: [
      {
        heading: 'Space stops behaving normally',
        body:
          'This step handles the weird spatial feeling: rooms stretching, distance curving, surfaces folding inward, and depth feeling larger than the actual scene. Hyperbolic geometry gives that sensation a visual grammar.',
      },
      {
        heading: 'How it becomes image language',
        body:
          'In practical art terms, this supports tunnel effects, expanding grids, curved perspective, and spaces that feel physically possible for half a second before your brain realizes the math is not everyday Euclidean space anymore.',
      },
    ],
    alt: 'Hyperbolic geometry and spatial perception',
  },
  {
    id: 'neurobiology-geometry',
    title: 'Neurobiology plus geometry',
    description:
      'The bridge between biological mechanisms and the clean mathematical structures that can describe them visually.',
    detailSections: [
      {
        heading: 'The bridge layer',
        body:
          'This is where the biology and geometry start shaking hands. The workflow treats the nervous system as the source of the signal and geometry as the way that signal becomes legible as structure.',
      },
      {
        heading: 'Why this makes the work stronger',
        body:
          'Without this bridge, the visuals risk becoming pure style. With it, the image can say: the body changed the signal, the visual system organized it, and the math gives the result a readable form.',
      },
    ],
    alt: 'Neon neurobiology and geometry visualization',
  },
  {
    id: 'kluver-forms',
    title: 'Kluver forms',
    description:
      'Classic visual motifs: tunnels, lattices, spirals, and repeating forms treated as usable art-language.',
    detailSections: [
      {
        heading: 'The classic forms',
        body:
          'Kluver forms are the recurring visual families people often report in altered states: lattices, tunnels, spirals, cobwebs, and repeating geometric fields. This step turns those forms into a controlled design vocabulary.',
      },
      {
        heading: 'How they are used',
        body:
          'Instead of dropping the same symbol everywhere, the workflow asks what each form should do. A tunnel can imply depth, a lattice can imply signal grid, a spiral can imply feedback, and a cobweb can imply perception catching too much information at once.',
      },
    ],
    alt: 'Kluver forms visual patterns in perception',
  },
  {
    id: 'stochastic-turing',
    title: 'Stochastic Turing patterns',
    description:
      'How noise turns into structure: pattern formation rules that can make randomness feel alive and intentional.',
    detailSections: [
      {
        heading: 'Noise becomes structure',
        body:
          'The stochastic Turing layer explains how unstable noise can become organized pattern. Randomness is not removed; it is pushed through rules until it starts forming islands, stripes, cells, waves, and repeated textures.',
      },
      {
        heading: 'Why it matters visually',
        body:
          'This is useful for psychedelic art because the best surfaces feel alive but not sloppy. They should have enough randomness to feel biological and enough structure to feel like the image has an internal nervous system.',
      },
    ],
    alt: 'Stochastic Turing process from noise to patterns',
  },
  {
    id: 'symmetry-texture',
    title: 'Symmetry and texture',
    description:
      'A design pass for turning scientific pattern logic into usable surface, texture, rhythm, and composition.',
    detailSections: [
      {
        heading: 'Design control',
        body:
          'After the science generates possible forms, this step decides how those forms behave as art. Symmetry, texture density, repetition, and contrast have to be composed, otherwise the image becomes visual soup with a fake lab coat on.',
      },
      {
        heading: 'What gets decided here',
        body:
          'This is where the workflow chooses what stays sharp, what gets noisy, what repeats, what breaks symmetry, and what becomes the main visual rhythm. It is the difference between a diagram of chaos and an artwork that actually lands.',
      },
    ],
    alt: 'Symmetry and texture in design process',
  },
  {
    id: 'fractal-flame',
    title: 'Fractal flame',
    description:
      'Recursive geometry pushed toward image-making: tiny rules repeated until they become luminous visual worlds.',
    detailSections: [
      {
        heading: 'Recursive energy',
        body:
          'Fractal flame logic is about small rules repeating at different scales until they become complex, glowing structures. It fits the workflow because altered perception often feels like detail is recursively generating more detail.',
      },
      {
        heading: 'Art use',
        body:
          'This supports luminous branching, flame-like geometry, nested shapes, and forms that feel like they are growing from themselves. It gives the final visuals depth without needing to invent random objects.',
      },
    ],
    alt: 'Fractal flame exploring recursive geometry',
  },
  {
    id: 'hyperbolic-perception',
    title: 'Hyperbolic perception',
    description:
      'A second geometry layer for impossible-feeling space, curved distance, and expanded perceptual fields.',
    detailSections: [
      {
        heading: 'Curved perception',
        body:
          'This step returns to hyperbolic geometry as a specific tool for impossible space. The point is not just distortion; it is the feeling that the rules of space have changed while the scene remains strangely readable.',
      },
      {
        heading: 'Composition effect',
        body:
          'It can make a flat image feel like it is opening, folding, or receding into a space that should not fit inside the frame. That is useful when the artwork needs to feel expansive without becoming a generic portal cliché.',
      },
    ],
    alt: 'Hyperbolic geometry and perception infographic',
  },
  {
    id: 'lens-post-fx',
    title: 'Lens post-FX',
    description:
      'The finishing lens layer: bloom, distortion, color splitting, and optical effects that make the system feel seen.',
    detailSections: [
      {
        heading: 'Making the invisible visible',
        body:
          'The lens post-FX stage is where the system becomes cinematic. Bloom, diffraction, chromatic splitting, blur, and glare are not just polish; they are the layer that makes the simulated perceptual pressure visible to the viewer.',
      },
      {
        heading: 'Keeping it controlled',
        body:
          'This step is dangerous because it can turn everything into cheap neon mush. The useful rule is to let effects reveal the structure that is already there, not cover weak structure with shiny panic.',
      },
    ],
    alt: 'Lens post-FX overview with neon design',
  },
  {
    id: 'multi-scale-pipeline',
    title: 'Multi-scale pipeline',
    description:
      'The zoomed-out model connecting molecules, neurons, patterns, geometry, and final artwork in one process.',
    detailSections: [
      {
        heading: 'Multi-scale chain',
        body:
          'This step zooms out and connects the layers: molecular trigger, neural timing, field dynamics, geometric pattern, design composition, and final rendered image. It is the full map of how one level feeds the next.',
      },
      {
        heading: 'Why this belongs in the portfolio',
        body:
          'It shows that the workflow is not just prompt-and-pray image generation. It is a way of thinking: each artwork can be treated as a stack of decisions, from biological inspiration to mathematical pattern to final aesthetic judgment.',
      },
    ],
    alt: 'Multi-scale pipeline of perception dynamics',
  },
  {
    id: 'simulation-pipeline',
    title: 'Simulation pipeline',
    description:
      'The final production map: a compact view of how perception science becomes a repeatable visual system.',
    detailSections: [
      {
        heading: 'Repeatable system',
        body:
          'The final pipeline turns the whole idea into something repeatable. Instead of making one lucky image, the workflow can be reused: define the perceptual mechanism, choose the pattern family, control the geometry, apply lens behavior, and compose the final result.',
      },
      {
        heading: 'Final meaning',
        body:
          'This is the strongest portfolio message: the work is psychedelic, but it is not careless. It sits between art, neuroscience, simulation, and design craft, which makes the process itself part of the artwork.',
      },
    ],
    alt: 'Neon simulation pipeline diagram',
  },
] as const;

const WORKFLOW_LARGE_IMAGE_DESCRIPTOR_WIDTHS = [
  1200,
  1122,
  941,
  941,
  941,
  941,
  941,
  941,
  941,
  941,
  941,
  941,
  941,
  941,
  941,
] as const;

const WORKFLOW_LARGE_IMAGE_HEIGHTS = [
  800,
  1402,
  1672,
  1672,
  1672,
  1672,
  1672,
  1672,
  1672,
  1672,
  1672,
  1672,
  1672,
  1672,
  1672,
] as const;

export function getWorkflowImageDimensions(stepNumber: number): { width: number; height: number } {
  const width = WORKFLOW_LARGE_IMAGE_DESCRIPTOR_WIDTHS[stepNumber - 1] ?? 1200;
  const height = WORKFLOW_LARGE_IMAGE_HEIGHTS[stepNumber - 1] ?? 1200;
  return { width, height };
}

export function getWorkflowImageUrl(stepNumber: number, fileWidth: number): string {
  return `/images/workflow/workflow-step-${String(stepNumber).padStart(2, '0')}-${fileWidth}.webp`;
}

export function getWorkflowImageDescriptorWidth(stepNumber: number, fileWidth: number): number {
  if (fileWidth !== 1200) {
    return fileWidth;
  }

  return WORKFLOW_LARGE_IMAGE_DESCRIPTOR_WIDTHS[stepNumber - 1] ?? fileWidth;
}

export function getWorkflowSrcset(stepNumber: number): string {
  return WORKFLOW_IMAGE_FILE_WIDTHS
    .map((fileWidth) => (
      `${getWorkflowImageUrl(stepNumber, fileWidth)} ${getWorkflowImageDescriptorWidth(stepNumber, fileWidth)}w`
    ))
    .join(', ');
}
