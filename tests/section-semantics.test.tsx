import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ContactSection from '../src/sections/ContactSection';
import { GallerySection } from '../src/sections/GallerySection';
import { LibrarySection } from '../src/sections/LibrarySection';
import { CONTACT_COPY, GALLERY_COPY } from '../src/content/siteCopy';
import { installMatchMediaMock } from './helpers/matchMedia';

vi.mock('../src/components/InteractiveArtworkCard', () => ({
  default: function MockInteractiveArtworkCard() {
    return <div data-testid="mock-artwork-card" />;
  },
}));

describe('section semantics', () => {
  it('keeps the contact heading accessible in the editorial contact surface', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
    });
    render(<ContactSection reducedMotion={false} />);

    const heading = screen.getByRole('heading', { name: CONTACT_COPY.heading });

    expect(CONTACT_COPY.heading).toBe(CONTACT_COPY.headingParts.lead);
    expect(heading).toHaveAttribute('id', 'contact-heading');
    expect(heading).toHaveClass('contact-title');
    expect(heading).toHaveTextContent(CONTACT_COPY.headingParts.lead);
    expect(screen.getByRole('region', { name: CONTACT_COPY.heading })).toBeInTheDocument();
  });

  it('keeps the gallery region named from the gallery heading while the supporting copy stays visible', () => {
    render(<GallerySection reducedMotion={false} />);

    const heading = screen.getByRole('heading', { name: GALLERY_COPY.heading });
    expect(heading).toHaveAttribute('id', 'selected-works-heading');
    expect(heading).toHaveClass('selected-work-title');
    expect(screen.getByRole('region', { name: GALLERY_COPY.heading })).toBeInTheDocument();
    expect(screen.getByText(GALLERY_COPY.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(GALLERY_COPY.subtitle)).toBeInTheDocument();
  });

  it('keeps the archive named and only mounts artwork cards for the open chapter', () => {
    render(<LibrarySection reducedMotion={false} />);

    const heading = screen.getByRole('heading', { name: /the living archive/i });
    expect(heading).toHaveAttribute('id', 'gallery-library-heading');
    expect(heading).toHaveClass('archive-title');
    expect(screen.getByRole('region', { name: /the living archive/i })).toBeInTheDocument();
    expect(screen.getByText(/49 works \/ 6 chapters/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /enter chapter/i })).toHaveLength(6);
    expect(screen.queryByTestId('mock-artwork-card')).not.toBeInTheDocument();

    const roomsChapter = screen.getByRole('button', { name: /rooms.*10 works.*enter chapter/i });
    fireEvent.click(roomsChapter);

    expect(roomsChapter).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByTestId('mock-artwork-card')).toHaveLength(10);
    expect(screen.getByText(/10 works in this chapter/i)).toBeInTheDocument();
  });
});
