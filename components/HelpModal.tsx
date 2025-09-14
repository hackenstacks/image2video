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
          User Manual 📖
        </h2>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Welcome to the AI Content Generator!
            </h3>
            <p className="mt-1">
              This tool allows you to create amazing videos and images using
              the power of generative AI. You can start from a text description,
              or use your own media to guide the creation process.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              1. Choose Your Creation Mode 🎬 / 🖼️
            </h4>
            <p className="mt-1">
              Use the toggle at the top of the main panel to switch between{' '}
              <strong>Video Generation</strong> and{' '}
              <strong>Image Generation</strong>. Each mode has its own unique
              options. Note: A mode may be disabled if its corresponding model
              is not configured (see Advanced Configuration below).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              🎬 Video Generation
            </h4>
            <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
              <li>
                <strong>Uploading Media:</strong> You can upload media in two
                ways: by adding multiple images, or uploading a single video.
                These are mutually exclusive options.
                <ul className="list-['-_'] list-inside space-y-1 pl-6 mt-1">
                  <li>
                    <strong>Multiple Images:</strong> Upload several images. The
                    AI will analyze all of them to create a detailed prompt for
                    your video, using the first image as the primary visual
                    starting point.
                  </li>
                  <li>
                    <strong>Single Video:</strong> A frame from the beginning of
                    your video will be used as the starting image for the AI. No
                    other images can be uploaded with a video.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Advanced Settings:</strong>
                <ul className="list-['-_'] list-inside space-y-1 pl-6 mt-1">
                  <li>
                    <strong>Aspect Ratio:</strong> Choose the shape of your
                    video (e.g., Widescreen, Vertical).
                  </li>
                  <li>
                    <strong>Duration:</strong> Suggest a desired length for your
                    video in seconds. The AI will try to match this duration.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              🖼️ Image Generation
            </h4>
            <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
              <li>
                <strong>Text-to-Image:</strong> This mode is for creating images
                purely from your text description. The media uploader will be
                disabled. Simply write a detailed prompt and let the AI work its
                magic!
              </li>

              <li>
                <strong>Advanced Settings:</strong>
                <ul className="list-['-_'] list-inside space-y-1 pl-6 mt-1">
                  <li>
                    <strong>Number of Images:</strong> Select how many different
                    images you want to generate from your prompt at once.
                  </li>
                  <li>
                    <strong>Aspect Ratio:</strong> Choose the shape of your
                    image (e.g., Square, Portrait).
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              2. Crafting Your Prompt ✍️
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
              <li>
                <strong>Be Descriptive:</strong> The more detail you provide,
                the better the result. Think about subjects, actions, colors,
                lighting, and mood. (e.g., "An astronaut cat floating in a
                nebula, painted in a vibrant watercolor style").
              </li>
              <li>
                <strong>✨ Prompt Assist:</strong> If you're stuck, type some
                keywords and click the "Assist" button. The AI will expand your
                ideas into a richer prompt.
              </li>
              <li>
                <strong>Upload from File:</strong> You can also upload a prompt
                from a .txt or .md file.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              3. Effects & Styles 🎨
            </h4>
            <p className="mt-1">
              Select a preset effect to give your creation a specific look and
              feel. Your choice will be saved for your next session. This adds
              keywords to your prompt to influence the style (e.g., 'Cinematic',
              'Anime', 'Vintage').
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              4. The Gallery & Remixing 갤러리
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
              <li>
                Your generated videos and images will appear in the gallery.
              </li>
              <li>
                Click any item to view it. From the video player, you can click
                "Remix" to use its prompt as a starting point for a new video.
              </li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              ⚙️ Advanced Configuration (.env file)
            </h4>
            <p className="mt-2">
              For local development, you can create a <code>.env</code> file in
              the project's root directory to configure your API key and custom
              model endpoints. The application reads these variables to enable
              features.
            </p>
            <p className="mt-2">
              If a model name variable is omitted, the app will use a default
              Google model. If you set a model name variable to be empty (e.g.,{' '}
              <code>VIDEO_MODEL_NAME=""</code>), that feature will be disabled
              in the UI.
            </p>
            <pre className="mt-3 p-3 bg-gray-900 dark:bg-gray-900/80 text-white text-sm rounded-md overflow-x-auto">
              <code>
                {`# Google AI API Key (Required)
API_KEY="YOUR_GOOGLE_AI_API_KEY"

# Optional: Override default model names
# An empty value disables the feature
VIDEO_MODEL_NAME="veo-2.0-generate-001"
IMAGE_MODEL_NAME="imagen-4.0-generate-001"
TEXT_MODEL_NAME="gemini-2.5-flash"

# Optional: For future use with embedding models
# EMBEDDING_MODEL_NAME="text-embedding-004"
`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
