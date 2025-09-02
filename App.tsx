/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useRef, useState} from 'react';
import {EditVideoPage} from './components/EditVideoPage';
import {ErrorModal} from './components/ErrorModal';
import {UploadIcon, VideoCameraIcon, XMarkIcon} from './components/icons';
import {SavingProgressPage} from './components/SavingProgressPage';
import {VideoGrid} from './components/VideoGrid';
import {VideoPlayer} from './components/VideoPlayer';
import {MOCK_VIDEOS} from './constants';
import {Video} from './types';

import {GeneratedVideo, GoogleGenAI} from '@google/genai';

const VEO_MODEL_NAME = 'veo-2.0-generate-001';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// --- UI Components ---

interface ImageUploaderProps {
  onImageUpload: (base64Image: string, mimeType: string) => void;
  onImageRemove: () => void;
  uploadedImagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onImageRemove,
  uploadedImagePreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageUpload(base64String, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleRemoveImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageRemove();
  };

  return (
    <div className="w-full">
      {uploadedImagePreview ? (
        <div className="relative group">
          <img
            src={uploadedImagePreview}
            alt="Image preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-700/50 hover:border-purple-500 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}>
          <UploadIcon className="w-10 h-10 mb-2" />
          <p className="text-sm">Drag & drop or click to upload</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) =>
              e.target.files && handleFileChange(e.target.files[0])
            }
            className="hidden"
            accept="image/*"
          />
        </div>
      )}
    </div>
  );
};

// --- API Helpers ---

function bloblToBase64(blob: Blob) {
  return new Promise<string>(async (resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve(url.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
}

async function processVideoGenerationOperation(operation: any): Promise<string[]> {
  let currentOperation = operation;
  while (!currentOperation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log('...Generating...');
    currentOperation = await ai.operations.getVideosOperation({
      operation: currentOperation,
    });
  }

  if (currentOperation?.response) {
    const videos = currentOperation.response?.generatedVideos;
    if (videos === undefined || videos.length === 0) {
      throw new Error('No videos generated');
    }

    return await Promise.all(
      videos.map(async (generatedVideo: GeneratedVideo) => {
        const url = decodeURIComponent(generatedVideo.video.uri);
        const res = await fetch(`${url}&key=${process.env.API_KEY}`);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch video: ${res.status} ${res.statusText}`,
          );
        }
        const blob = await res.blob();
        return bloblToBase64(blob);
      }),
    );
  } else {
    throw new Error('No videos generated');
  }
}

async function generateVideoFromText(
  prompt: string,
  numberOfVideos = 1,
): Promise<string[]> {
  const operation = await ai.models.generateVideos({
    model: VEO_MODEL_NAME,
    prompt,
    config: {
      numberOfVideos,
      aspectRatio: '16:9',
    },
  });
  return processVideoGenerationOperation(operation);
}

async function generateVideoFromImageAndText(
  prompt: string,
  image: {base64: string; mimeType: string},
  numberOfVideos = 1,
): Promise<string[]> {
  const operation = await ai.models.generateVideos({
    model: VEO_MODEL_NAME,
    prompt,
    image: {
      imageBytes: image.base64,
      mimeType: image.mimeType,
    },
    config: {
      numberOfVideos,
    },
  });
  return processVideoGenerationOperation(operation);
}

/**
 * Main component for the Veo Gallery app.
 * It manages the state of videos, playing videos, editing videos and error handling.
 */
export const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [generationError, setGenerationError] = useState<string[] | null>(
    null,
  );
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);

  const handleImageUpload = (base64: string, mimeType: string) => {
    setUploadedImage({base64, mimeType});
    setUploadedImagePreview(`data:${mimeType};base64,${base64}`);
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
    setUploadedImagePreview(null);
  };

  const handlePlayVideo = (video: Video) => {
    setPlayingVideo(video);
  };

  const handleClosePlayer = () => {
    setPlayingVideo(null);
  };

  const handleStartEdit = (video: Video) => {
    setPlayingVideo(null); // Close player
    setEditingVideo(video); // Open edit page
  };

  const handleCancelEdit = () => {
    setEditingVideo(null); // Close edit page, return to grid
  };

  const handleSaveEdit = async (originalVideo: Video) => {
    setEditingVideo(null);
    setIsSaving(true);
    setGenerationError(null);

    try {
      const promptText = originalVideo.description;
      console.log('Generating video...', promptText);
      const videoObjects = await generateVideoFromText(promptText);

      if (!videoObjects || videoObjects.length === 0) {
        throw new Error('Video generation returned no data.');
      }

      console.log('Generated video data received.');

      const mimeType = 'video/mp4';
      const videoSrc = videoObjects[0];
      const src = `data:${mimeType};base64,${videoSrc}`;

      const newVideo: Video = {
        id: self.crypto.randomUUID(),
        title: `Remix of "${originalVideo.title}"`,
        description: originalVideo.description,
        videoUrl: src,
      };

      setVideos((currentVideos) => [newVideo, ...currentVideos]);
      setPlayingVideo(newVideo); // Go to the new video
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationError([
        'Video generation failed. Veo is only available on the Paid Tier.',
        'Please select your Cloud Project to get started',
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateFromImage = async () => {
    if (!prompt || !uploadedImage) return;

    setIsSaving(true);
    setGenerationError(null);

    try {
      console.log('Generating video from image and text...', prompt);
      const videoObjects = await generateVideoFromImageAndText(
        prompt,
        uploadedImage,
      );

      if (!videoObjects || videoObjects.length === 0) {
        throw new Error('Video generation returned no data.');
      }

      console.log('Generated video data received.');
      const mimeType = 'video/mp4';
      const videoSrc = videoObjects[0];
      const src = `data:${mimeType};base64,${videoSrc}`;

      const newVideo: Video = {
        id: self.crypto.randomUUID(),
        title: `Video from prompt: ${prompt.substring(0, 30)}...`,
        description: prompt,
        videoUrl: src,
      };

      setVideos((currentVideos) => [newVideo, ...currentVideos]);
      setPlayingVideo(newVideo);
      setPrompt('');
      handleImageRemove();
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationError([
        'Video generation failed. Veo is only available on the Paid Tier.',
        'Please select your Cloud Project to get started',
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return <SavingProgressPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {editingVideo ? (
        <EditVideoPage
          video={editingVideo}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className="mx-auto max-w-[1080px]">
          <header className="p-6 md:p-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text inline-flex items-center gap-4">
              <VideoCameraIcon className="w-10 h-10 md:w-12 md:h-12" />
              <span>Veo Gallery</span>
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Select a video to generate your own variations or create a new one
              below
            </p>
          </header>
          <main className="px-4 md:px-8 pb-8">
            <section className="mb-8 p-4 md:p-6 bg-gray-800/50 rounded-lg">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
                Create with Image & Text
              </h2>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  uploadedImagePreview={uploadedImagePreview}
                />
                <div className="flex flex-col h-full">
                  <textarea
                    rows={5}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200 flex-grow"
                    placeholder="Enter a prompt to animate your image..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    aria-label="Video generation prompt"
                  />
                  <button
                    onClick={handleGenerateFromImage}
                    disabled={!prompt || !uploadedImage}
                    className="mt-4 w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Generate Video
                  </button>
                </div>
              </div>
            </section>
            <VideoGrid videos={videos} onPlayVideo={handlePlayVideo} />
          </main>
        </div>
      )}

      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          onClose={handleClosePlayer}
          onEdit={handleStartEdit}
        />
      )}

      {generationError && (
        <ErrorModal
          message={generationError}
          onClose={() => setGenerationError(null)}
          onSelectKey={async () => await window.aistudio?.openSelectKey()}
        />
      )}
    </div>
  );
};
