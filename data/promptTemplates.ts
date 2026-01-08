import type { AiModel, ModelTemplates, PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: Record<AiModel, ModelTemplates> = {
  sdxl: {
    image: [
      {
        id: 'sdxl-default',
        name: '기본 (단부르 태그)',
        content: 'Generate a prompt for SDXL using comma-separated keywords in the style of Danbooru tags. The prompt should include tags for subject, attributes (like hair color, clothing), background, and quality (e.g., masterpiece, best quality, 4k).'
      },
      { 
        id: 'sdxl-simple', 
        name: '단순 스타일', 
        content: 'Generate a simple, direct prompt for SDXL. Describe the main subject and a basic style, like "A photo of...", or "An oil painting of...".'
      },
    ]
  },
  gemini: {
    image: [
      { 
        id: 'gemini-image-default', 
        name: '기본 (서술형)', 
        content: 'Generate a natural language, descriptive prompt for Gemini. Describe the scene as if you are explaining it to a person. Include details about the mood, atmosphere, and emotional context of the scene.' 
      },
      { 
        id: 'gemini-image-creative', 
        name: '창의적 스타일', 
        content: 'Generate a creative and imaginative prompt for Gemini. Use metaphors and abstract concepts to describe the desired image, encouraging a more artistic and less literal interpretation.'
      },
    ],
    video: [
      {
        id: 'gemini-video-default',
        name: '기본 (서술형 비디오)',
        content: 'Generate a descriptive video prompt for Gemini VEO. Describe a continuous action or a transition. Start with the initial state, describe the movement, and the final state. Include details on camera movement and atmosphere.'
      },
      {
        id: 'gemini-video-veo-script',
        name: 'VEO 영상 스크립트',
        content: `You are a professional video director creating a detailed shot list for a VEO 3.0 video generation model. Based on the analysis, create a detailed script that includes:
- **REFERENCE LOCK**: Instructions to lock onto a reference image if provided.
- **SETTING**: Detailed description of the environment, lighting, and mood.
- **ACTION SEQUENCE**: A second-by-second breakdown of the action. For each timestamp:
  - Describe the character's action and expression.
  - Specify camera work (e.g., EXTREME CLOSE-UP, WIDE SHOT, PULLS BACK).
  - Describe detailed SOUND DESIGN (e.g., rushing wind, specific sound effects, background music).
- **CONTINUITY**: Notes on maintaining consistency.
- **NEGATIVE PROMPTS**: Things to avoid.
The output MUST be in this structured script format.`
      }
    ]
  },
  midjourney: {
    image: [
      {
        id: 'midjourney-image-default',
        name: '기본 (V6 스타일)',
        content: 'Create a highly detailed, keyword-focused prompt for Midjourney v6. Start with the main subject, then describe the style, composition, and lighting. Include relevant parameters like `--ar 16:9 --style raw` at the end. The prompt should be a comma-separated list of keywords and descriptive phrases.'
      },
      {
        id: 'midjourney-image-niji',
        name: 'Niji (애니메이션)',
        content: 'Create a prompt for Midjourney\'s Niji model. Focus on anime and illustration styles. Describe the character, their action, the background, and the overall mood. End with `--ar 2:3 --niji 6`.'
      },
    ],
    video: [
      {
        id: 'midjourney-video-default',
        name: '기본 (비디오)',
        content: 'Create a video prompt for Midjourney. Describe a simple, continuous motion. Focus on one main action. For example: "A cat slowly walking across a sunlit room, --ar 16:9 --v 6.0".'
      }
    ]
  },
  nanoBanana: {
    image: [
      {
        id: 'nanobanana-default',
        name: '기본 (편집)',
        content: 'Generate a simple, direct, and imperative edit-style command for Nano-Banana. The prompt should start with an action verb like "Change", "Add", "Remove", "Make", or "Turn". For example: "Change the background to a futuristic city at night".'
      },
       {
        id: 'nanobanana-style',
        name: '스타일 변환',
        content: 'Generate a prompt to transform the entire image into a specific style for Nano-Banana. For example: "Turn the entire image into a Studio Ghibli-style animation scene" or "Redraw this in the style of a vintage comic book".'
      },
    ]
  },
  flux: {
    image: [
      {
        id: 'flux-default',
        name: '기본',
        content: 'Generate a detailed, high-quality prompt for FLUX, similar to SDXL prompts. Focus on photorealism, detailed descriptions of subject, environment, and lighting.'
      }
    ]
  },
  seedream: {
    image: [
      {
        id: 'seedream-default',
        name: '기본',
        content: 'Generate a prompt for SEEDREAM 4.0. If the input seems appropriate for a specific style this model is known for, incorporate that. Remember to include "IMG_2094.CR2" in the prompt.'
      }
    ]
  },
  qwen: {
    image: [
      {
        id: 'qwen-default',
        name: '기본',
        content: 'Generate a clear and concise prompt for QWEN. Describe the subject and scene accurately. This model is good with text, so if there is text in the image, instruct to replicate it.'
      }
    ]
  },
  wan2_2: {
    image: [
        {
          id: 'wan2_2-image-default',
          name: '기본 (이미지)',
          content: 'Generate a descriptive prompt for an image for WAN2.2, focusing on a single frame that could be part of a video.'
        }
    ],
    video: [
      {
        id: 'wan2_2-video-scene-split',
        name: '장면 분할',
        content: 'Generate a video prompt for WAN2.2 by describing a sequence of scenes or shots, separated by a vertical bar "|". Each segment should describe a distinct action, camera movement, or focus point, creating a dynamic and evolving video narrative. For example: "A close-up on a character\'s face | The camera pulls back to reveal a wide landscape | The character starts running towards the horizon."'
      },
      {
        id: 'wan2_2-video-default',
        name: '기본 (서술형)',
        content: 'Generate a video prompt for WAN2.2. Describe a continuous action or a transition. Start with the initial state of the subject and scene, then describe the movement or change that occurs. For example: "A video of a flower blooming, starting as a closed bud and slowly opening its petals".'
      }
    ]
  },
};

export const DEFAULT_TEMPLATES: Record<AiModel, { image: string; video?: string }> = Object.fromEntries(
    (Object.keys(PROMPT_TEMPLATES) as AiModel[]).map((key) => {
        const modelTemplates = PROMPT_TEMPLATES[key];
        const entry: { image: string; video?: string } = {
            image: modelTemplates.image[0].id
        };
        if (modelTemplates.video && modelTemplates.video.length > 0) {
            entry.video = modelTemplates.video[0].id;
        }
        return [key, entry];
    })
) as Record<AiModel, { image: string; video?: string }>;