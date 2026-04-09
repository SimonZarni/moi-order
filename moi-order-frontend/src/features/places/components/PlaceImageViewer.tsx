import React from 'react';
import ImageViewing from 'react-native-image-viewing';

interface PlaceImageViewerProps {
  images: { uri: string }[];
  /** Index to open at. Pass -1 (or any value where visible=false) to hide. */
  index: number;
  onClose: () => void;
}

export function PlaceImageViewer({ images, index, onClose }: PlaceImageViewerProps): React.JSX.Element {
  return (
    <ImageViewing
      images={images}
      imageIndex={index < 0 ? 0 : index}
      visible={index >= 0}
      onRequestClose={onClose}
      swipeToCloseEnabled
      doubleTapToZoomEnabled
      presentationStyle="overFullScreen"
    />
  );
}
