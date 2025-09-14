/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Artwork} from './types';

/** Base URL for static files. */
const staticFilesUrl =
  'https://www.gstatic.com/aistudio/starter-apps/veo3-gallery/';

/** Default model names */
export const DEFAULT_VEO_MODEL = 'veo-2.0-generate-001';
export const DEFAULT_IMAGEN_MODEL = 'imagen-4.0-generate-001';
export const DEFAULT_FLASH_MODEL = 'gemini-2.5-flash';

/** Initial items for the gallery. */
export const INITIAL_GALLERY_ITEMS: Artwork[] = [
  {
    id: '1',
    title: "Stop Motion: Fluffy Characters' Culinary Disaster",
    videoUrl:
      staticFilesUrl + 'Stop_Motion_Fluffy_Characters__Culinary_Disaster.mp4',
    description: `Fluffy Characters Stop Motion: Inside a brightly colored, cozy kitchen made of felt and yarn. Professor Nibbles, a plump, fluffy hamster with oversized glasses, nervously stirs a bubbling pot on a miniature stove, muttering, "Just a little more... 'essence of savory,' as the recipe calls for." The camera is a mid-shot, capturing his frantic stirring. Suddenly, the pot emits a loud "POP!" followed by a comical "whoosh" sound, and a geyser of iridescent green slime erupts, covering the entire kitchen. Professor Nibbles shrieks, "Oh, dear! Not again!" and scurries away, leaving a trail of tiny, panicked squeaks.`,
    type: 'video',
  },
  {
    id: '2',
    title: "Claymation: Robot's Existential Crisis",
    videoUrl: staticFilesUrl + 'Claymation_Robot_s_Existential_Crisis.mp4',
    description: `Claymation (Stop Motion): In a quirky, cluttered garage workshop, a wide shot reveals a crudely built clay robot with mismatching parts, staring forlornly at a broken wrench. The camera slowly zooms in on its face, which expresses a comical frown. A robotic, monotone voice emanates from it, "Unit 734 reports... purpose undefined. Wrench... non-functional." A whirring of internal gears is heard, followed by a sad "boop-beep" sound. An eccentric human inventor with wild, yarn hair enters the frame, looks at the robot, and cheerfully exclaims, "Nonsense, 734! Your purpose is to fetch my coffee!" The robot's eyes slowly widen as it responds, "Coffee... new directive detected. Scanning for nearest caffeine source."`,
    type: 'video',
  },
];
