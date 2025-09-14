/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {ImageArtwork} from '../types';
import {XMarkIcon} from './icons';

interface ImageViewerProps {
  image: ImageArtwork;
  onClose: () => void;
}

/**
 * A modal component that renders an image viewer with description.
 */
export const ImageViewer: React.FC<ImageViewerProps> = ({image, onClose}) => {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 p-2 sm:p-4">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-300 hover:text-white z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            aria-label="Close image viewer">
            <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="bg-black rounded-md overflow-hidden flex justify-center items-center">
            <img
              key={image.id}
              className="max-w-full max-h-[70vh] object-contain"
              src={image.imageUrl}
              alt={image.title}
            />
          </div>
        </div>
        <div className="flex-1 p-4 pt-2 overflow-y-auto">
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0 whitespace-pre-wrap flex-1">
            {image.description}
          </p>
        </div>
      </div>
    </div>
  );
};
