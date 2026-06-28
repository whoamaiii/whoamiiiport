import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ShaderHeading } from '../src/components/ShaderHeading';
import ContactSection from '../src/sections/ContactSection';
import { GallerySection } from '../src/sections/GallerySection';
import { LibrarySection } from '../src/sections/LibrarySection';
import { CONTACT_COPY, GALLERY_COPY } from '../src/content/siteCopy';
import { installMatchMediaMock } from './helpers/matchMedia';

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

vi.mock('../src/components/InteractiveArtworkCard', () => ({
  default: function MockInteractiveArtworkCard() {
    return <div data-testid="mock-artwork-card" />;
  },
}));

describe('section semantics', () => {
  it('keeps the contact heading accessible while rendering through the shader heading system', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
    });
    render(<ContactSection reducedMotion={false} />);

    const heading = screen.getByRole('heading', { name: CONTACT_COPY.heading });

    expect(CONTACT_COPY.heading).toBe(
      `${CONTACT_COPY.headingParts.lead} ${CONTACT_COPY.headingParts.accent}`,
    );
    expect(heading).toHaveAttribute('data-heading-variant', 'default');
    expect(heading).toHaveTextContent(CONTACT_COPY.headingParts.lead);
    expect(heading).toHaveTextContent(CONTACT_COPY.headingParts.accent);
  });

  it('allows named regions to reference the default shader heading by id', () => {
    render(
      <section aria-labelledby="selected-works-heading">
        <ShaderHeading id="selected-works-heading">Selected Works.</ShaderHeading>
      </section>,
    );

    const heading = screen.getByRole('heading', { name: /selected works\./i });
    expect(heading).toHaveAttribute('id', 'selected-works-heading');
    expect(heading).toHaveAttribute('data-heading-variant', 'default');
    expect(screen.getByRole('region', { name: /selected works\./i })).toBeInTheDocument();
  });

  it('uses ShaderHeading ariaLabel as semantic text without naming from decorative lines', () => {
    render(
      <ShaderHeading ariaLabel="Selected Works." visualLines={['Archive', 'Signals']}>
        Gallery overview
      </ShaderHeading>,
    );

    expect(screen.getByRole('heading', { name: /selected works\./i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /archive signals/i })).not.toBeInTheDocument();
  });

  it('keeps the gallery region named from the gallery heading while the supporting copy stays visible', () => {
    render(<GallerySection reducedMotion={false} />);

    const heading = screen.getByRole('heading', { name: /selected works\./i });
    expect(heading).toHaveAttribute('id', 'selected-works-heading');
    expect(heading).toHaveAttribute('data-heading-variant', 'gallery');
    expect(screen.getByRole('region', { name: /selected works\./i })).toBeInTheDocument();
    expect(screen.getByText(GALLERY_COPY.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(GALLERY_COPY.subtitle)).toBeInTheDocument();
  });

  it('keeps the full gallery region named as a separate library surface', () => {
    render(<LibrarySection reducedMotion={false} />);

    const heading = screen.getByRole('heading', { name: /gallery\./i });
    expect(heading).toHaveAttribute('id', 'gallery-library-heading');
    expect(heading).toHaveAttribute('data-heading-variant', 'gallery');
    expect(screen.getByRole('region', { name: /gallery\./i })).toBeInTheDocument();
    expect(screen.getByText(/full artwork library/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-artwork-card')).toHaveLength(18);
  });
});
