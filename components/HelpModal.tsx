/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {XMarkIcon} from './icons';

interface HelpModalProps {
  onClose: () => void;
}

/**
 * A modal component that displays a detailed user manual for the application.
 */
export const HelpModal: React.FC<HelpModalProps> = ({onClose}) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="help-modal-title">
      <div
        className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-2xl w-full max-w-2xl relative p-6 md:p-8 m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white z-10 p-2 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close help manual">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2
          id="help-modal-title"
          className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          User Manual
        </h2>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Welcome to AI Video Generator!
            </h3>
            <p className="mt-1">
              This tool allows you to create short videos from images, other
              videos, and text prompts using generative AI.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              1. Uploading Media
            </h4>
            <p className="mt-1">
              You can upload media in two ways: by adding multiple images, or
              uploading a single video. These are mutually exclusive options.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
              <li>
                <strong>Multiple Images:</strong> Drag and drop, click to
                browse, or use the "Add more" button to upload several images.
                The AI will analyze all images to create a more detailed prompt
                for your video, using the first image as the primary visual
                starting point.
              </li>
              <li>
                <strong>Single Video:</strong> You can upload a short video
                clip. A single frame from the beginning of your video will be
                used as the starting image for the AI. No other images can be
                uploaded alongside a video.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              2. Crafting Your Prompt
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
              <li>
                <strong>Keywords:</strong> Start with simple keywords (e.g., "a
                cat flying through space").
              </li>
              <li>
                <strong>Prompt Assist:</strong> If you're stuck, type some
                keywords and click the "Assist" button. The AI will expand your
                ideas into a more detailed prompt.
              </li>
              <li>
                <strong>Upload from File:</strong> You can also upload a prompt
                from a .txt or .md file.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              3. Effects & Styles
            </h4>
            <p className="mt-1">
              Select a preset effect to give your video a specific look and
              feel. The effect will be added to your prompt to influence the
              generation style (e.g., 'Cinematic', 'Anime', 'Vintage').
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              4. Generating and Editing
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
              <li>
                Once your media and prompt are ready, click "Generate Video".
                This may take a few minutes.
              </li>
              <li>Your generated videos will appear in the gallery below.</li>
              <li>
                Click on any video to play it. From the player, you can click
                "Remix" to use its prompt as a starting point for a new video.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              5. Theme
            </h4>
            <p className="mt-1">
              Use the sun/moon icon in the top right corner to switch between
              light and dark themes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};