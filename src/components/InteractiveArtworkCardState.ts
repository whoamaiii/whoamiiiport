export type GalleryImageLoading = 'eager' | 'lazy';
export type GalleryImageFetchPriority = 'high' | 'low' | 'auto';

type ArtworkCardState = {
  readonly imageCanLoad: boolean;
  readonly isHovered: boolean;
  readonly isModalOpen: boolean;
  readonly showInfo: boolean;
  readonly useMobilePriorityPreview: boolean;
};

type ArtworkCardAction =
  | { readonly type: 'setHovered'; readonly isHovered: boolean }
  | { readonly type: 'openModal'; readonly showInfo: boolean }
  | { readonly type: 'closeModal' }
  | { readonly type: 'setInfo'; readonly showInfo: boolean }
  | {
      readonly type: 'resetImageLoad';
      readonly imageCanLoad: boolean;
      readonly useMobilePriorityPreview: boolean;
    }
  | {
      readonly type: 'imageCanLoad';
      readonly useMobilePriorityPreview: boolean;
    }
  | { readonly type: 'completeMobilePriorityPreview' };

type MobilePriorityPreviewInput = {
  readonly imageCanLoad: boolean;
  readonly imageLoading: GalleryImageLoading;
  readonly isMobileLayout: boolean;
};

export const CARD_SPRING_CONFIG = { damping: 25, stiffness: 200 } as const;

export function artworkCardReducer(
  state: ArtworkCardState,
  action: ArtworkCardAction,
): ArtworkCardState {
  switch (action.type) {
    case 'setHovered':
      return state.isHovered === action.isHovered
        ? state
        : { ...state, isHovered: action.isHovered };
    case 'openModal':
      return {
        ...state,
        isModalOpen: true,
        showInfo: action.showInfo,
      };
    case 'closeModal':
      return state.isModalOpen || state.showInfo
        ? { ...state, isModalOpen: false, showInfo: false }
        : state;
    case 'setInfo':
      return state.showInfo === action.showInfo
        ? state
        : { ...state, showInfo: action.showInfo };
    case 'resetImageLoad':
      return state.imageCanLoad === action.imageCanLoad
        && state.useMobilePriorityPreview === action.useMobilePriorityPreview
        ? state
        : {
            ...state,
            imageCanLoad: action.imageCanLoad,
            useMobilePriorityPreview: action.useMobilePriorityPreview,
          };
    case 'imageCanLoad':
      return state.imageCanLoad && state.useMobilePriorityPreview === action.useMobilePriorityPreview
        ? state
        : {
            ...state,
            imageCanLoad: true,
            useMobilePriorityPreview: action.useMobilePriorityPreview,
          };
    case 'completeMobilePriorityPreview':
      return state.useMobilePriorityPreview
        ? { ...state, useMobilePriorityPreview: false }
        : state;
    default: {
      const unreachable: never = action;
      return unreachable;
    }
  }
}

export function shouldUseMobilePriorityPreview({
  imageCanLoad,
  imageLoading,
  isMobileLayout,
}: MobilePriorityPreviewInput): boolean {
  return imageCanLoad && isMobileLayout && imageLoading === 'eager';
}
