/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {Artwork, ImageArtwork, Video} from '../types';
import {ImageCard} from './ImageCard';
import {VideoCard} from './VideoCard';

interface VideoGridProps {
  videos: Artwork[];
  onPlayVideo: (video: Video) => void;
  onViewImage: (image: ImageArtwork) => void;
}

/**
 * A component that renders a grid of video and image cards.
 */
export const VideoGrid: React.FC<VideoGridProps> = ({
  videos: items,
  onPlayVideo,
  onViewImage,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {items.map((item) =>
        item.type === 'video' ? (
          <VideoCard key={item.id} video={item} onPlay={onPlayVideo} />
        ) : (
          <ImageCard key={item.id} image={item} onView={onViewImage} />
        ),
      )}
    </div>
  );
};
