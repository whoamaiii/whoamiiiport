import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeroShaderTitle } from '../src/components/HeroShaderTitle';

vi.mock('../src/lib/shaderRenderer', () => ({
  ShaderRenderer: class MockShaderRenderer {
    element = document.createElement('canvas');
    render = vi.fn();
    start = vi.fn((onFrame: (canvas: HTMLCanvasElement, time: number) => void) => {
      onFrame(this.element, 0.25);
    });
    stop = vi.fn();
    dispose = vi.fn();
    resize = vi.fn();
  },
}));

describe('Hero hero title accessibility', () => {
  it('keeps accessible heading text when the visible title is canvas-based', () => {
    render(
      <h1 aria-label="Altered Perceptions.">
        <span className="sr-only">Altered Perceptions.</span>
        <HeroShaderTitle
          firstLine="Altered"
          secondLine="Perceptions"
          trailing={<span aria-hidden="true">.</span>}
        />
      </h1>,
    );

    expect(
      screen.getByRole('heading', { name: /altered perceptions/i }),
    ).toBeInTheDocument();
  });
});
