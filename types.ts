/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Interface defining the structure of a video object, including its ID, URL,
 * title, and description.
 */
export interface Video {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  type: 'video';
}

/**
 * Interface defining the structure of an image artwork object.
 */
export interface ImageArtwork {
  id: string;
  imageUrl: string;
  title: string;
  description: string; // The prompt used to generate it
  type: 'image';
}

export type Artwork = Video | ImageArtwork;
