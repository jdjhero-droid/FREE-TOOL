import { GoogleGenAI, Modality, Type } from "@google/genai";
import { getAiInstance } from "./apiKeyService";
import type { GenerationConfig, BgPropImage, VideoPrompts, AiModel } from "../types";

const MAX_RETRIES = 3;
const PRESERVE_DETAILS_PROMPT = "The subject's clothing, face, and background from the uploaded image should be preserved exactly — unless specifically instructed to change them.";

interface RequestConfig {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
    responseSchema?: any;
    imageConfig?: {
        aspectRatio?: string;
        imageSize?: string;
    };
    thinkingConfig?: {
      thinkingBudget?: number;
    };
}

const getModelAndConfig = (config?: GenerationConfig): { model: string, requestConfig: RequestConfig } => {
    let model = 'gemini-2.5-flash-image';
    let requestConfig: RequestConfig = {};

    if (config) {
        requestConfig.imageConfig = {
            aspectRatio: config.aspectRatio || '1:1',
        };

        if (config.model === 'nano-banana-pro') {
            model = 'gemini-3-pro-image-preview'; 
            requestConfig.imageConfig.imageSize = config.imageSize || '1K';
        }
    }
    return { model, requestConfig };
};

const getVisionModel = () => 'gemini-2.5-flash'; 
const getThinkingModel = () => 'gemini-2.5-flash';

export interface PromptAnalysisResult {
    contextAnalysis: string;
    prompts: Record<string, { image: { korean: string; english: string }; video?: { korean: string; english: string } }>;
}

export const generateImage = async (
    prompt: string,
    image: { data: string; mime: string } | null,
    config?: GenerationConfig
): Promise<string> => {
    const images = image ? [{ data: image.data, mime: image.mime }] : [];
    const finalPrompt = image ? `${prompt} ${PRESERVE_DETAILS_PROMPT}` : prompt;
    return generateImageWithGemini(images, finalPrompt, config);
};

export const editImageWithNanoBanana = async (
    base64Data: string,
    mimeType: string,
    prompt: string,
    config?: GenerationConfig
): Promise<string> => {
    return generateImageWithGemini([ { data: base64Data, mime: mimeType } ], `${prompt} ${PRESERVE_DETAILS_PROMPT}`, config);
};

export const generateCosplayImage = async (
    mainData: string, mainMime: string,
    refData: string, refMime: string,
    mainPrompt: string,
    bgPrompt: string,
    config?: GenerationConfig
): Promise<string> => {
    const prompt = `${mainPrompt} ${bgPrompt} ${PRESERVE_DETAILS_PROMPT}`;
    return generateImageWithGemini([
        { data: mainData, mime: mainMime },
        { data: refData, mime: refMime }
    ], prompt, config);
};

export const editImageWithOptionalReference = async (
    mainImage: { data: string; mime: string },
    prompt: string,
    refImage: { data: string; mime: string } | null,
    config?: GenerationConfig
): Promise<string> => {
    const images = [mainImage];
    if (refImage) images.push(refImage);
    return generateImageWithGemini(images, `${prompt} ${PRESERVE_DETAILS_PROMPT}`, config);
};

export const generateBackgroundAndPropsImage = async (
    mainImage: BgPropImage | null,
    backgrounds: (BgPropImage | null)[],
    propsImages: (BgPropImage | null)[],
    userPrompt: string,
    config?: GenerationConfig
): Promise<string> => {
    const images: { data: string; mime: string }[] = [];
    if (mainImage) images.push({ data: mainImage.data, mime: mainImage.mime });
    backgrounds.forEach(bg => { if(bg) images.push({ data: bg.data, mime: bg.mime }) });
    propsImages.forEach(prop => { if(prop) images.push({ data: prop.data, mime: prop.mime }) });

    return generateImageWithGemini(images, `${userPrompt} ${PRESERVE_DETAILS_PROMPT}`, config);
};

export const generateSnapshotImage = async (
    images: { data: string; mimeType: string }[],
    prompt: string,
    config?: GenerationConfig
): Promise<string> => {
    const formattedImages = images.map(img => ({ data: img.data, mime: img.mimeType }));
    return generateImageWithGemini(formattedImages, `${prompt} ${PRESERVE_DETAILS_PROMPT}`, config);
};

export const generateStartEndFrame = async (
    data: string,
    mime: string,
    storyPrompt: string,
    direction: 'start-to-end' | 'end-to-start',
    config?: GenerationConfig
): Promise<string> => {
    const prompt = direction === 'start-to-end'
        ? `Given the starting frame (image provided) and the story: "${storyPrompt}", generate the ending frame image.`
        : `Given the ending frame (image provided) and the story: "${storyPrompt}", generate the starting frame image Sun.`;
    
    return generateImageWithGemini([{ data, mime }], `${prompt} ${PRESERVE_DETAILS_PROMPT}`, config);
};

export const generateStoryImageFromSource = async (
    sourceImage: { data: string; mime: string },
    framePrompt: string,
    config?: GenerationConfig
): Promise<string> => {
    return generateImageWithGemini([sourceImage], `${framePrompt} ${PRESERVE_DETAILS_PROMPT}`, config);
};

export const generateProfilePhoto = async (
  baseImages: { data: string; mime: string }[],
  prompt: string,
  config?: GenerationConfig
): Promise<string> => {
    return generateImageWithGemini(baseImages, `${prompt} ${PRESERVE_DETAILS_PROMPT}`, config);
};

// Common function for image generation using Gemini
const generateImageWithGemini = async (
    images: { data: string; mime: string }[],
    prompt: string,
    config?: GenerationConfig
): Promise<string> => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const ai = getAiInstance();
            const { model, requestConfig } = getModelAndConfig(config);

            const parts: any[] = images.map(img => ({
                inlineData: {
                    mimeType: img.mime,
                    data: img.data
                }
            }));
            parts.push({ text: prompt });

            const response = await ai.models.generateContent({
                model: model,
                contents: { parts },
                config: {
                    ...requestConfig,
                }
            });

            const candidates = response.candidates;
            if (candidates && candidates.length > 0) {
                const content = candidates[0].content;
                if (content && content.parts) {
                    for (const part of content.parts) {
                        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        }
                    }
                }
            }
            throw new Error("No image generated.");

        } catch (error) {
            console.error(`Attempt ${attempt} failed`, error);
            if (attempt === MAX_RETRIES) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    throw new Error("Image generation failed.");
};

export const generatePromptsFromImage = async (
    base64Data: string,
    mimeType: string,
    additionalPrompt: string,
    models: AiModel[],
    isKorean: boolean,
    templates?: Record<AiModel, { image: string; video?: string }>
): Promise<PromptAnalysisResult> => {
    const ai = getAiInstance();
    const model = getVisionModel();

    const analysisPrompt = `Analyze this image in detail. Focus on the subject, style, lighting, composition, and mood. ${additionalPrompt ? `Consider this additional context: ${additionalPrompt}.` : ''} 
    Provide a detailed visual description suitable for generating similar images with AI models.`;

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { mimeType, data: base64Data } },
                { text: analysisPrompt }
            ]
        }
    });

    const analysisText = response.text || "Analysis failed";

    const promptsResult: Record<string, { image: { korean: string, english: string }, video?: { korean: string, english: string } }> = {};

    for (const targetModel of models) {
        const promptGenPrompt = `Based on this image analysis: "${analysisText}", create optimal prompts for the AI model: ${targetModel}.
        
        ${templates?.[targetModel]?.image ? `Use this structure for the image prompt: ${templates[targetModel].image}` : ''}
        ${templates?.[targetModel]?.video ? `Use this structure for the video prompt: ${templates[targetModel].video}` : ''}

        Important: For any video prompt generated (video_ko, video_en), always append exactly: "There is no slow motion, and the scene unfolds quickly." at the very end of the prompt text.

        Return JSON with keys:
        - "image_ko": Korean image prompt
        - "image_en": English image prompt
        ${templates?.[targetModel]?.video ? '- "video_ko": Korean video prompt\n- "video_en": English video prompt' : ''}
        `;

        const pResponse = await ai.models.generateContent({
            model: getThinkingModel(),
            contents: promptGenPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        image_ko: { type: Type.STRING },
                        image_en: { type: Type.STRING },
                        video_ko: { type: Type.STRING },
                        video_en: { type: Type.STRING },
                    }
                }
            }
        });

        if (pResponse.text) {
            try {
                const json = JSON.parse(pResponse.text);
                promptsResult[targetModel] = {
                    image: { korean: json.image_ko, english: json.image_en }
                };
                if (json.video_ko && json.video_en) {
                    promptsResult[targetModel].video = { korean: json.video_ko, english: json.video_en };
                }
            } catch (e) {
                console.error(`Failed to parse prompt for ${targetModel}`, e);
            }
        }
    }

    return {
        contextAnalysis: analysisText,
        prompts: promptsResult
    };
};

export const generatePromptsFromText = async (
    userPrompt: string,
    models: AiModel[],
    isKorean: boolean,
    templates?: Record<AiModel, { image: string; video?: string }>
): Promise<PromptAnalysisResult> => {
    const ai = getAiInstance();
    const model = getThinkingModel();

    const promptsResult: Record<string, { image: { korean: string, english: string }, video?: { korean: string, english: string } }> = {};

    for (const targetModel of models) {
        const promptGenPrompt = `Based on this user idea: "${userPrompt}", create optimal prompts for the AI model: ${targetModel}.
        
        ${templates?.[targetModel]?.image ? `Use this structure for the image prompt: ${templates[targetModel].image}` : ''}
        ${templates?.[targetModel]?.video ? `Use this structure for the video prompt: ${templates[targetModel].video}` : ''}

        Important: For any video prompt generated (video_ko, video_en), always append exactly: "There is no slow motion, and the scene unfolds quickly." at the very end of the prompt text.

        Return JSON with keys:
        - "image_ko": Korean image prompt
        - "image_en": English image prompt
        ${templates?.[targetModel]?.video ? '- "video_ko": Korean video prompt\n- "video_en": English video prompt' : ''}
        `;

        const pResponse = await ai.models.generateContent({
            model,
            contents: promptGenPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        image_ko: { type: Type.STRING },
                        image_en: { type: Type.STRING },
                        video_ko: { type: Type.STRING },
                        video_en: { type: Type.STRING },
                    }
                }
            }
        });

        if (pResponse.text) {
            try {
                const json = JSON.parse(pResponse.text);
                promptsResult[targetModel] = {
                    image: { korean: json.image_ko, english: json.image_en }
                };
                if (json.video_ko && json.video_en) {
                    promptsResult[targetModel].video = { korean: json.video_ko, english: json.video_en };
                }
            } catch (e) {
                console.error(`Failed to parse prompt for ${targetModel}`, e);
            }
        }
    }

    return {
        contextAnalysis: userPrompt,
        prompts: promptsResult
    };
};

export const regeneratePromptVariation = async (
    base64Data: string,
    mimeType: string,
    currentPrompt: string
): Promise<string> => {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
        model: getThinkingModel(),
        contents: {
            parts: [
                { inlineData: { mimeType, data: base64Data } },
                { text: `Based on this image and the current prompt: "${currentPrompt}", create a variation of the prompt that might yield better or more interesting results. Keep it in the same language as the current prompt. Return only the new prompt text.` }
            ]
        }
    });
    return response.text || currentPrompt;
};

export const generatePromptForBgProp = async (
    mainImage: BgPropImage,
    backgrounds: (BgPropImage | null)[],
    propsImages: (BgPropImage | null)[],
): Promise<string> => {
    const ai = getAiInstance();
    const parts: any[] = [{ inlineData: { mimeType: mainImage.mime, data: mainImage.data } }];
    backgrounds.forEach(bg => { if (bg) parts.push({ inlineData: { mimeType: bg.mime, data: bg.data } }); });
    propsImages.forEach(prop => { if (prop) parts.push({ inlineData: { mimeType: prop.mime, data: prop.data } }); });
    
    parts.push({ text: "Analyze these images (Main subject, Backgrounds, Props). Write a prompt to compose them into a single coherent scene where the main subject is in one of the backgrounds holding or interacting with the props. The prompt should be descriptive and in Korean." });

    const response = await ai.models.generateContent({
        model: getThinkingModel(),
        contents: { parts }
    });
    return response.text || "";
};

export const generateStoryPlan = async (
    prompt: string,
    frameCount: number,
    progression: number
): Promise<{ frames: { frame_number: number, prompt_for_image_model: string }[] }> => {
    const ai = getAiInstance();
    const systemInstruction = `You are a storyboard artist. Create a ${frameCount}-frame story based on the user's prompt. 
    The story progression intensity is ${progression}/10. 
    Return a JSON object with a 'frames' array. Each frame has 'frame_number' and 'prompt_for_image_model'.`;

    const response = await ai.models.generateContent({
        model: getThinkingModel(),
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    frames: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                frame_number: { type: Type.INTEGER },
                                prompt_for_image_model: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return { frames: [] };
};

export const modifyPromptForJob = async (prompt: string, jobTitle: string): Promise<string> => {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
        model: getThinkingModel(),
        contents: `Modify this image generation prompt: "${prompt}" to reflect the profession "${jobTitle}". 
        Adjust clothing, accessories, and possibly the setting subtly to match the job, but keep the original composition and style. Return only the modified prompt.`
    });
    return response.text || prompt;
};

export const modifyPromptForConcept = async (prompt: string, concept: string): Promise<string> => {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
        model: getThinkingModel(),
        contents: `Modify this image generation prompt: "${prompt}" to incorporate the concept/object: "${concept}". 
        Make it natural. Return only the modified prompt.`
    });
    return response.text || prompt;
};

export const generateVideoPromptsForFrames = async (
    startImg: { data: string; mime: string },
    endImg: { data: string; mime: string },
    storyPrompt: string
): Promise<VideoPrompts> => {
    const ai = getAiInstance();
    
    const prompt = `Given the start frame and end frame images, and the story context: "${storyPrompt}", 
    generate video generation prompts optimized for these models: Wan2.5, Kling2.5, Midjourney, and Veo3.0.
    
    Ensure that every generated video prompt ends exactly with: "There is no slow motion, and the scene unfolds quickly."

    Return JSON with keys: wan2_5, kling2_5, midjourney, veo3_0.
    `;

    const response = await ai.models.generateContent({
        model: getThinkingModel(),
        contents: {
            parts: [
                { inlineData: { mimeType: startImg.mime, data: startImg.data } },
                { inlineData: { mimeType: endImg.mime, data: endImg.data } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    wan2_5: { type: Type.STRING },
                    kling2_5: { type: Type.STRING },
                    midjourney: { type: Type.STRING },
                    veo3_0: { type: Type.STRING },
                }
            }
        }
    });

    if (response.text) {
        return JSON.parse(response.text) as VideoPrompts;
    }
    throw new Error("Failed to generate video prompts");
};