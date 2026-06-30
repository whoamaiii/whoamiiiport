import type { ModalImageSlug } from '../utils/images';

export interface ArtworkSection {
  readonly heading?: string;
  readonly body: string;
  readonly formula?: string;
  readonly formulaCaption?: string;
}

export type ArtworkTitle = {
  readonly primary: string;
  readonly secondary?: string;
};

export interface SpecialArtwork {
  readonly imageSlug: ModalImageSlug;
  readonly videoSrc?: string;
  readonly title: ArtworkTitle;
  readonly sections: readonly ArtworkSection[];
  /** BCP 47 language of the notes sections when it differs from the page language. */
  readonly sectionsLang?: 'no';
}
