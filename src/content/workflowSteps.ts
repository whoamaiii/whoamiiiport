import { workflowFoundationSteps } from './workflowFoundationSteps';
import { workflowProductionSteps } from './workflowProductionSteps';
import type { WorkflowStep } from './workflowStepTypes';

export const WORKFLOW_IMAGE_FILE_WIDTHS = [480, 800, 1200] as const;

export const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  ...workflowFoundationSteps,
  ...workflowProductionSteps,
];

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
