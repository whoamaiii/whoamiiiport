export interface WorkflowStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly detailSections: readonly {
    readonly heading: string;
    readonly body: string;
  }[];
  readonly alt: string;
}
