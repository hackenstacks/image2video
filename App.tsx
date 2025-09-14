/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useRef, useState, useEffect} from 'react';
import {
  EditVideoPage,
  ErrorModal,
  HelpModal,
  ImageViewer,
  SavingProgressPage,
  VideoGrid,
  VideoPlayer,
  ArrowPathIcon,
  ChevronDownIcon,
  DocumentArrowUpIcon,
  MoonIcon,
  PhotoIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  SunIcon,
  UploadIcon,
  VideoCameraIcon,
  XMarkIcon,
} from './components';
import {
  INITIAL_GALLERY_ITEMS,
  DEFAULT_VEO_MODEL,
  DEFAULT_IMAGEN_MODEL,
  DEFAULT_FLASH_MODEL,
} from './constants';
import {Artwork, ImageArtwork, Video} from './types';
import {GeneratedVideo, GoogleGenAI} from '@google/genai';

// Use model names from environment variables with fallbacks to defaults
const VEO_MODEL_NAME = process.env.VIDEO_MODEL_NAME ?? DEFAULT_VEO_MODEL;
const IMAGEN_MODEL_NAME = process.env.IMAGE_MODEL_NAME ?? DEFAULT_IMAGEN_MODEL;
const FLASH_MODEL_NAME = process.env.TEXT_MODEL_NAME ?? DEFAULT_FLASH_MODEL;

// Determine if features are enabled based on model configuration
const isVideoGenEnabled = !!VEO_MODEL_NAME;
const isImageGenEnabled = !!IMAGEN_MODEL_NAME;
const isPromptAssistEnabled = !!FLASH_MODEL_NAME;

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const EFFECTS = [
  {name: 'None', prompt: ''},
  {
    name: 'Cinematic',
    prompt:
      ', cinematic style, dramatic lighting, high contrast, wide-angle shot',
  },
  {name: 'Anime', prompt: ', anime style, vibrant colors, cel-shaded'},
  {
    name: 'Vintage',
    prompt: ', vintage film look, grain, slightly desaturated colors, 1960s',
  },
  {name: 'Claymation', prompt: ', claymation style, stop-motion animation'},
  {name: 'Watercolor', prompt: ', watercolor painting style, soft edges'},
  {
    name: 'Painterly',
    prompt: ', painterly style, visible brushstrokes, rich colors, expressive',
  },
  {
    name: 'Digital Drawing',
    prompt:
      ', digital art style, clean lines, vibrant flat colors, graphic novel look',
  },
  {
    name: 'Realistic',
    prompt: ', photorealistic, 8k, hyper-detailed, cinematic lighting',
  },
  {
    name: 'Fantasy',
    prompt: ', fantasy style, magical atmosphere, ethereal lighting, epic and grand scale',
  },
];

// --- UI Components ---

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}
interface MediaUploaderProps {
  onFilesUpload: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
  uploadedFiles: UploadedFile[];
  disabled?: boolean;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onFilesUpload,
  onFileRemove,
  uploadedFiles,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasVideo = uploadedFiles.some((f) => f.type === 'video');

  const handleFileChange = (selectedFiles: FileList) => {
    if (!canUploadMore) return;
    onFilesUpload(Array.from(selectedFiles));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canUploadMore) return;
    handleFileChange(e.dataTransfer.files);
  };
  const handleClick = () => {
    if (!canUploadMore) return;
    fileInputRef.current?.click();
  };

  const acceptType = hasVideo ? '' : 'image/*,video/*';
  const canUploadMore = !hasVideo && !disabled;
  const isDisabled = disabled || !canUploadMore;

  const disabledClasses =
    'opacity-50 cursor-not-allowed hover:border-gray-400 dark:hover:border-gray-600';

  return (
    <div className="w-full">
      {uploadedFiles.length > 0 ? (
        <div
          className={`w-full p-1 border-2 border-dashed rounded-xl transition-colors ${
            isDisabled
              ? 'border-transparent'
              : 'border-gray-400/0 hover:border-gray-400/50 dark:hover:border-gray-600/50'
          }`}
          onDragOver={isDisabled ? undefined : handleDragOver}
          onDrop={isDisabled ? undefined : handleDrop}>
          <div className="grid grid-cols-3 gap-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="relative group aspect-square">
                {file.type === 'image' ? (
                  <img
                    src={file.preview}
                    alt="Image preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={file.preview}
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={() => onFileRemove(file.id)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove file"
                  title="Remove file">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            {!isDisabled && (
              <button
                onClick={handleClick}
                className="aspect-square border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:border-purple-500 transition-colors"
                aria-label="Add more files">
                <PlusIcon className="w-10 h-10 mb-1" />
                <p className="text-sm">Add more</p>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-colors ${
            isDisabled
              ? disabledClasses
              : 'cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:border-purple-500 border-gray-400 dark:border-gray-600'
          }`}
          onDragOver={isDisabled ? undefined : handleDragOver}
          onDrop={isDisabled ? undefined : handleDrop}
          onClick={isDisabled ? undefined : handleClick}
          role={isDisabled ? undefined : 'button'}
          tabIndex={isDisabled ? -1 : 0}
          aria-label="Upload media files">
          <UploadIcon className="w-10 h-10 mb-2" />
          <p className="text-sm">
            {disabled
              ? 'Media upload disabled for image generation'
              : 'Drag & drop images or a video'}
          </p>
          {!disabled && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              or click to browse
            </p>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFileChange(e.target.files)}
        className="hidden"
        accept={acceptType}
        multiple={!hasVideo}
        disabled={isDisabled}
      />
    </div>
  );
};

// --- API Helpers ---

function blobToBase64(blob: Blob) {
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
        return blobToBase64(blob);
      }),
    );
  } else {
    throw new Error('No videos generated');
  }
}

async function generateVideoFromText(
  prompt: string,
  aspectRatio: string,
  numberOfVideos = 1,
): Promise<string[]> {
  const operation = await ai.models.generateVideos({
    model: VEO_MODEL_NAME,
    prompt,
    config: {
      numberOfVideos,
      aspectRatio,
    },
  });
  return processVideoGenerationOperation(operation);
}

async function generateVideoFromImageAndText(
  prompt: string,
  image: {base64: string; mimeType: string},
  aspectRatio: string,
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
      aspectRatio,
    },
  });
  return processVideoGenerationOperation(operation);
}

async function generateImagesFromText(
  prompt: string,
  numberOfImages: number,
  aspectRatio: string,
): Promise<string[]> {
  const response = await ai.models.generateImages({
    model: IMAGEN_MODEL_NAME,
    prompt,
    config: {
      numberOfImages,
      outputMimeType: 'image/jpeg',
      aspectRatio,
    },
  });

  return response.generatedImages.map((img) => img.image.imageBytes);
}

async function extractFrameFromVideo(
  videoFile: File,
): Promise<{base64: string; mimeType: string}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      URL.revokeObjectURL(video.src);
      resolve({
        base64: dataUrl.split(',')[1],
        mimeType: 'image/jpeg',
      });
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video for frame extraction.'));
    };

    video.play().catch(reject);
  });
}

export const App: React.FC = () => {
  const [galleryItems, setGalleryItems] =
    useState<Artwork[]>(INITIAL_GALLERY_ITEMS);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [viewingImage, setViewingImage] = useState<ImageArtwork | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false);
  const [generationError, setGenerationError] = useState<string[] | null>(
    null,
  );
  const [prompt, setPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const promptFileInputRef = useRef<HTMLInputElement>(null);

  const [generationType, setGenerationType] = useState<
    'video' | 'image' | 'none'
  >(() => {
    if (isVideoGenEnabled) return 'video';
    if (isImageGenEnabled) return 'image';
    return 'none';
  });

  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [videoDuration, setVideoDuration] = useState(4);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAssisting, setIsAssisting] = useState(false);
  const [hasAssisted, setHasAssisted] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState(
    () => localStorage.getItem('selectedEffect') || EFFECTS[0].name,
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('selectedEffect', selectedEffect);
  }, [selectedEffect]);

  const handleFilesUpload = (files: File[]) => {
    const hasVideoAlready = uploadedFiles.some((f) => f.type === 'video');
    if (hasVideoAlready) return;

    const containsVideo = Array.from(files).some((f) =>
      f.type.startsWith('video/'),
    );

    if (containsVideo) {
      const videoFile = Array.from(files).find((f) =>
        f.type.startsWith('video/'),
      );
      if (videoFile) {
        setUploadedFiles([
          {
            id: self.crypto.randomUUID(),
            file: videoFile,
            preview: URL.createObjectURL(videoFile),
            type: 'video',
          },
        ]);
      }
      return;
    }

    const newImageFiles: UploadedFile[] = [];
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        newImageFiles.push({
          id: self.crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          type: 'image',
        });
      }
    }

    if (newImageFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newImageFiles]);
    }
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handlePromptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setGenerationError([
          'Prompt file is too large. Please select a file smaller than 1MB.',
        ]);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setPrompt(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadPromptClick = () => {
    promptFileInputRef.current?.click();
  };

  const handlePromptAssist = async () => {
    if (!prompt) {
      setGenerationError(['Please enter some keywords to get assistance.']);
      return;
    }
    setIsAssisting(true);
    setGenerationError(null);
    try {
      const response = await ai.models.generateContent({
        model: FLASH_MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction:
            'You are a creative assistant for a video generation tool. Your task is to take the user-provided keywords and expand them into a single, detailed, and vivid paragraph suitable for generating a high-quality video. Focus on visual details, camera movements, lighting, and mood.',
        },
      });
      setPrompt(response.text);
      setHasAssisted(true);
    } catch (error) {
      console.error('Prompt assistance failed:', error);
      setGenerationError(['Failed to get prompt assistance from the AI.']);
    } finally {
      setIsAssisting(false);
    }
  };

  const handleSaveEdit = async (originalVideo: Video) => {
    setEditingVideo(null);
    setIsSaving(true);
    setGenerationError(null);

    try {
      const promptText = originalVideo.description;
      const videoObjects = await generateVideoFromText(promptText, '16:9');

      if (!videoObjects || videoObjects.length === 0) {
        throw new Error('Video generation returned no data.');
      }

      const newVideo: Video = {
        id: self.crypto.randomUUID(),
        title: `Remix of "${originalVideo.title}"`,
        description: originalVideo.description,
        videoUrl: `data:video/mp4;base64,${videoObjects[0]}`,
        type: 'video',
      };

      setGalleryItems((current) => [newVideo, ...current]);
      setPlayingVideo(newVideo);
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationError([
        'Video generation failed. This may be due to a network issue or an invalid API key or model name.',
        'Please check your configuration and try again.',
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (
      !prompt ||
      (generationType === 'video' && uploadedFiles.length === 0)
    ) {
      return;
    }

    setIsSaving(true);
    setGenerationError(null);

    try {
      const effect = EFFECTS.find((e) => e.name === selectedEffect);
      let fullPrompt = prompt + (effect ? effect.prompt : '');

      if (generationType === 'video') {
        let finalPrompt = fullPrompt;

        if (
          uploadedFiles.length > 1 &&
          uploadedFiles.every((f) => f.type === 'image')
        ) {
          setIsCreatingPrompt(true);
          const imageParts = await Promise.all(
            uploadedFiles.map(async (file) => {
              const base64 = await blobToBase64(file.file);
              return {
                inlineData: {
                  data: base64,
                  mimeType: file.file.type,
                },
              };
            }),
          );

          const promptEnhancementResponse = await ai.models.generateContent({
            model: FLASH_MODEL_NAME,
            contents: {
              parts: [
                ...imageParts,
                {
                  text: `Based on the user's prompt "${prompt}" and the provided images, create a single, detailed, and vivid paragraph describing a scene for a video. The scene should creatively incorporate elements from all the images. For example, you could take a character from one image and place them in the scene of another. Be descriptive about visual details, camera movements, lighting, and mood. This description will be used to generate a high-quality video.`,
                },
              ],
            },
          });
          finalPrompt = promptEnhancementResponse.text;
          setPrompt(finalPrompt);
          setIsCreatingPrompt(false);
        }

        let imageInput: {base64: string; mimeType: string};
        const firstFile = uploadedFiles[0];

        if (firstFile.type === 'video') {
          imageInput = await extractFrameFromVideo(firstFile.file);
        } else {
          const base64 = await blobToBase64(firstFile.file);
          imageInput = {base64, mimeType: firstFile.file.type};
        }

        const durationPrompt = ` The video should be approximately ${videoDuration} seconds long.`;
        finalPrompt += durationPrompt;

        const videoObjects = await generateVideoFromImageAndText(
          finalPrompt,
          imageInput,
          aspectRatio,
        );

        if (!videoObjects || videoObjects.length === 0) {
          throw new Error('Video generation returned no data.');
        }

        const newVideo: Video = {
          id: self.crypto.randomUUID(),
          title: `Video from prompt: ${prompt.substring(0, 30)}...`,
          description: fullPrompt,
          videoUrl: `data:video/mp4;base64,${videoObjects[0]}`,
          type: 'video',
        };

        setGalleryItems((current) => [newVideo, ...current]);
        setPlayingVideo(newVideo);
      } else if (generationType === 'image') {
        // Image generation
        const imageObjects = await generateImagesFromText(
          fullPrompt,
          numberOfImages,
          aspectRatio,
        );

        const newImages: ImageArtwork[] = imageObjects.map((base64) => ({
          id: self.crypto.randomUUID(),
          title: `Image from prompt: ${prompt.substring(0, 30)}...`,
          description: fullPrompt,
          imageUrl: `data:image/jpeg;base64,${base64}`,
          type: 'image',
        }));

        setGalleryItems((current) => [...newImages, ...current]);
        if (newImages.length > 0) {
          setViewingImage(newImages[0]);
        }
      }

      setPrompt('');
      setUploadedFiles([]);
      setHasAssisted(false);
    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationError([
        'Generation failed. This may be due to a network issue or an invalid API key or model name.',
        'Please check your configuration and try again.',
      ]);
    } finally {
      setIsSaving(false);
      setIsCreatingPrompt(false);
    }
  };

  if (isSaving) {
    const message =
      generationType === 'video'
        ? 'Generating your video...'
        : 'Generating your image(s)...';
    const subMessage =
      generationType === 'video'
        ? 'Please wait while we bring your vision to life. This may take a few minutes.'
        : 'The AI is creating your masterpiece. This should be quick!';
    return (
      <SavingProgressPage
        isCreatingPrompt={isCreatingPrompt}
        message={message}
        subMessage={subMessage}
      />
    );
  }

  const isGenerateDisabled =
    !prompt ||
    (generationType === 'video' && uploadedFiles.length === 0) ||
    isAssisting ||
    isCreatingPrompt ||
    generationType === 'none';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-[#1c162c] text-gray-800 dark:text-gray-100 font-sans">
      {editingVideo ? (
        <EditVideoPage
          video={editingVideo}
          onSave={handleSaveEdit}
          onCancel={() => setEditingVideo(null)}
        />
      ) : (
        <div className="mx-auto max-w-[1080px]">
          <header className="p-6 md:p-8 flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text inline-flex items-center gap-3">
              <SparklesIcon className="w-8 h-8 md:w-10 md:h-10" />
              <span>AI Content Generator</span>
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelpModal(true)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Help"
                aria-label="Open user manual">
                <QuestionMarkCircleIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
                aria-label={`Switch to ${
                  theme === 'dark' ? 'light' : 'dark'
                } mode`}>
                {theme === 'dark' ? (
                  <SunIcon className="w-6 h-6" />
                ) : (
                  <MoonIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </header>
          <main className="px-4 md:px-8 pb-8">
            <section className="mb-12 p-6 md:p-8 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-purple-900/10">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Create with AI
                </h2>
                <div className="mt-4 sm:mt-0 flex-shrink-0 p-1 bg-gray-200 dark:bg-gray-900/80 rounded-full">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setGenerationType('video')}
                      disabled={!isVideoGenEnabled}
                      className={`px-4 py-1.5 text-sm rounded-full transition-colors flex items-center justify-center gap-2 ${
                        generationType === 'video'
                          ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white font-semibold shadow'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                      } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent`}>
                      <VideoCameraIcon className="w-5 h-5" />
                      Video
                    </button>
                    <button
                      onClick={() => setGenerationType('image')}
                      disabled={!isImageGenEnabled}
                      className={`px-4 py-1.5 text-sm rounded-full transition-colors flex items-center justify-center gap-2 ${
                        generationType === 'image'
                          ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white font-semibold shadow'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                      } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent`}>
                      <PhotoIcon className="w-5 h-5" />
                      Image
                    </button>
                  </div>
                </div>
              </div>

              {generationType === 'none' && (
                <div className="text-center py-10 px-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-xl">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                    No generation models configured.
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Please configure your API key and model names in your
                    environment variables. See the help manual for more
                    details.
                  </p>
                </div>
              )}

              <div
                className={`grid md:grid-cols-2 gap-6 items-start ${
                  generationType === 'none' ? 'hidden' : ''
                }`}>
                <MediaUploader
                  onFilesUpload={handleFilesUpload}
                  onFileRemove={handleFileRemove}
                  uploadedFiles={uploadedFiles}
                  disabled={generationType === 'image'}
                />
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="prompt-input"
                      className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Prompt
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePromptAssist}
                        disabled={
                          isAssisting || !prompt || !isPromptAssistEnabled
                        }
                        className="inline-flex items-center gap-1.5 text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-wait"
                        title={
                          !isPromptAssistEnabled
                            ? 'Prompt assist model not configured'
                            : hasAssisted
                            ? 'Regenerate prompt'
                            : 'Assist with prompt'
                        }
                        aria-label="Assist with prompt generation">
                        {hasAssisted ? (
                          <ArrowPathIcon className="w-4 h-4" />
                        ) : (
                          <SparklesIcon className="w-5 h-5" />
                        )}
                        <span>{hasAssisted ? 'Regenerate' : 'Assist'}</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="prompt-input"
                    rows={5}
                    className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200 flex-grow"
                    placeholder="Describe what you want to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleUploadPromptClick}
                      className="inline-flex items-center gap-2 text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                      title="Upload prompt from a text file">
                      <DocumentArrowUpIcon className="w-5 h-5" />
                      <span>Upload prompt</span>
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={promptFileInputRef}
                    onChange={handlePromptFileSelect}
                    className="hidden"
                    accept=".txt,.md"
                  />

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Effects
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {EFFECTS.map((effect) => (
                        <button
                          key={effect.name}
                          onClick={() => setSelectedEffect(effect.name)}
                          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                            selectedEffect === effect.name
                              ? 'bg-purple-600 text-white font-semibold'
                              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                          }`}
                          title={effect.prompt}>
                          {effect.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className="flex justify-between items-center w-full text-left text-sm font-medium text-gray-600 dark:text-gray-300"
                      title="Toggle advanced settings">
                      <span>Advanced Settings</span>
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform ${
                          isSettingsOpen ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isSettingsOpen && (
                      <div className="mt-3 grid grid-cols-2 gap-4 animate-fade-in">
                        <div>
                          <label
                            htmlFor="aspect-ratio"
                            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Aspect Ratio
                          </label>
                          <select
                            id="aspect-ratio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
                            <option value="16:9">16:9 (Widescreen)</option>
                            <option value="9:16">9:16 (Vertical)</option>
                            <option value="1:1">1:1 (Square)</option>
                            <option value="4:3">4:3 (Standard)</option>
                            <option value="3:4">3:4 (Portrait)</option>
                          </select>
                        </div>
                        {generationType === 'video' ? (
                          <div>
                            <label
                              htmlFor="duration"
                              className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Duration (seconds)
                            </label>
                            <input
                              type="number"
                              id="duration"
                              value={videoDuration}
                              min="1"
                              max="10"
                              onChange={(e) =>
                                setVideoDuration(Number(e.target.value))
                              }
                              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        ) : (
                          <div>
                            <label
                              htmlFor="num-images"
                              className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Number of Images
                            </label>
                            <input
                              type="number"
                              id="num-images"
                              value={numberOfImages}
                              min="1"
                              max="4"
                              onChange={(e) =>
                                setNumberOfImages(Number(e.target.value))
                              }
                              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerateDisabled}
                    className="mt-6 w-full px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-purple-500">
                    {isAssisting
                      ? 'Assisting...'
                      : isCreatingPrompt
                      ? 'Creating prompt...'
                      : `Generate ${
                          generationType.charAt(0).toUpperCase() +
                          generationType.slice(1)
                        }`}
                  </button>
                </div>
              </div>
            </section>
            <VideoGrid
              videos={galleryItems}
              onPlayVideo={(video) => setPlayingVideo(video)}
              onViewImage={(image) => setViewingImage(image)}
            />
          </main>
        </div>
      )}

      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          onClose={() => setPlayingVideo(null)}
          onEdit={(video) => {
            setPlayingVideo(null);
            setEditingVideo(video);
          }}
        />
      )}

      {viewingImage && (
        <ImageViewer
          image={viewingImage}
          onClose={() => setViewingImage(null)}
        />
      )}

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}

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
