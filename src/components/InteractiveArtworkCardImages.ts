import type { ModalImageSlug } from '../utils/images';
import {
  getAvifImageUrl,
  getGalleryAvifSrcset,
  getGalleryImageUrl,
  getGallerySizes,
  getGallerySrcset,
  getImageMetadata,
  getImageUrl,
  getModalAvifSrcset,
  getModalImageUrl,
  getModalSrcset,
} from '../utils/images';

type InteractiveArtworkCardImagesInput = {
  readonly imageCanLoad: boolean;
  readonly imageSlug: ModalImageSlug;
  readonly isVideoArtwork: boolean;
  readonly useMobilePriorityPreview: boolean;
};

type InteractiveArtworkCardImages = {
  readonly displayedAvifImageSrcset?: string;
  readonly displayedImageSizes?: string;
  readonly displayedImageSrc?: string;
  readonly displayedImageSrcset?: string;
  readonly imageAlt: string;
  readonly imageObjectPosition?: string;
  readonly modalAvifSrcset?: string;
  readonly modalImageUrl: string;
  readonly modalSrcset?: string;
};

export function getInteractiveArtworkCardImages({
  imageCanLoad,
  imageSlug,
  isVideoArtwork,
  useMobilePriorityPreview,
}: InteractiveArtworkCardImagesInput): InteractiveArtworkCardImages {
  const imageMeta = getImageMetadata(imageSlug);
  const mobilePriorityAvifUrl = getAvifImageUrl(imageSlug, 560);
  const mobilePriorityUrl = getImageUrl(imageSlug, 560);
  const displayedAvifImageSrcset =
    imageCanLoad
      ? useMobilePriorityPreview
        ? mobilePriorityAvifUrl
        : getGalleryAvifSrcset(imageSlug)
      : undefined;
  const displayedImageSrc =
    useMobilePriorityPreview
      ? mobilePriorityUrl
      : imageCanLoad
        ? getGalleryImageUrl(imageSlug)
        : undefined;

  return {
    displayedAvifImageSrcset,
    displayedImageSizes: imageCanLoad && !useMobilePriorityPreview ? getGallerySizes() : undefined,
    displayedImageSrc,
    displayedImageSrcset: imageCanLoad && !useMobilePriorityPreview ? getGallerySrcset(imageSlug) : undefined,
    imageAlt: imageMeta.alt,
    imageObjectPosition: imageMeta.galleryObjectPosition,
    modalAvifSrcset: isVideoArtwork ? undefined : getModalAvifSrcset(imageSlug),
    modalImageUrl: getModalImageUrl(imageSlug),
    modalSrcset: isVideoArtwork ? undefined : getModalSrcset(imageSlug),
  };
}
