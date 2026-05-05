interface ErrorMetadata {
  componentStack?: string;
  [key: string]: unknown;
}

export default function reportError(error: unknown, context: string, metadata?: ErrorMetadata) {
  if (!import.meta.env.DEV) {
    return;
  }

  console.error(`[${context}]`, error, metadata ?? {});
}
