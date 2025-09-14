/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface SavingProgressPageProps {
  isCreatingPrompt?: boolean;
  message?: string;
  subMessage?: string;
}

/**
 * A fullscreen overlay that displays a loading animation and text indicating that
 * a video remix is being created.
 */
export const SavingProgressPage: React.FC<SavingProgressPageProps> = ({
  isCreatingPrompt,
  message,
  subMessage,
}) => {
  const mainMessage =
    message ??
    (isCreatingPrompt ? 'Analyzing images...' : 'Generating your video...');
  const secondaryMessage =
    subMessage ??
    (isCreatingPrompt
      ? 'Creating a detailed prompt based on your images.'
      : 'Please wait while we bring your vision to life. This may take a few minutes.');

  return (
    <div
      className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center z-50 animate-fade-in"
      aria-live="polite"
      aria-busy="true">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">
        {mainMessage}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 text-center px-4">
        {secondaryMessage}
      </p>
    </div>
  );
};
