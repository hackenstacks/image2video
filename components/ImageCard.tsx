/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {ImageArtwork} from '../types';
import {PhotoIcon} from './icons';

interface ImageCardProps {
  image: ImageArtwork;
  onView: (image: ImageArtwork) => void;
}

/**
 * A component that renders an image card with a thumbnail and view button.
 */
export const ImageCard: React.FC<ImageCardProps> = ({image, onView}) => {
  return (
    <button
      type="button"
      className="group w-full text-left bg-white dark:bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-gray-400/30 dark:hover:shadow-gray-600/30 transform transition-all duration-300 hover:-translate-y-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900"
      onClick={() => onView(image)}
      aria-label={`View image: ${image.title}`}>
      <div className="relative">
        <img
          className="w-full h-48 object-cover pointer-events-none"
          src={image.imageUrl}
          alt={image.title}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PhotoIcon className="w-16 h-16 text-white opacity-80 drop-shadow-lg group-hover:opacity-100 transform group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="p-4">
        <h3
          className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate"
          title={image.title}>
          {image.title}
        </h3>
      </div>
    </button>
  );
};
