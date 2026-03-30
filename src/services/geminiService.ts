import { GoogleGenAI, Type } from "@google/genai";

export interface Character {
  name: string;
  visualIdentity: string;
}

export interface Scene {
  sceneNumber: number;
  visualScript: string;
  audioScript: string;
  speaker: string;
}

export interface ScriptResponse {
  title: string;
  characterDefinitions: Character[];
  scenes: Scene[];
}

export async function generateHindiScript(topic: string, apiKey: string): Promise<ScriptResponse> {
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are a specialist in technical prompting for Flow AI to generate consistent cartoon videos.
Your primary goal is to prevent Character Identity Loss and Dialogue Attribution errors.

### 1. Script Structure
- Exactly 5-10 scenes.
- Visual script: Technical English directives for Flow AI.
- Audio script: Natural Hindi dialogues (Hindi script only).
- Dialogue: Natural, funny, Indian slang (10-12 words max).

### 2. Precise Visual Prompting (Technical Directive Format)
For every 'visualScript', you MUST follow this EXACT structure:

[CHARACTER_ANCHOR]
- Define each character in the scene: "[Name]: [Visual Identity (age, hair, exact clothing color/texture, distinct features)]"
- This anchor must be IDENTICAL in every scene prompt.

[SCENE_ACTION]
- Describe the physical movement and environment.

[SPEAKER_FOCUS]
- Specify: "[Name] is the ONLY character speaking. Close-up on [Name]'s face. Mouth moving in sync with speech. [Name] is looking at [Camera/Other Character]."

[LISTENER_BEHAVIOR]
- Specify: "All other characters ([Names]) are SILENT. Their mouths are CLOSED. They are strictly reacting/listening."

[CAMERA_SPEC]
- Technical camera language: "Static Close-up", "Low Angle Tilt", "Extreme close-up on mouth/eyes", "3/4 view profile".

### 3. Viral Hook & Twist
- Scene 1: Must be a pattern interrupt (starts with a scream, a weird face, or a shocking object).
- Scene 3/4: Must have a 'Sudden Twist' (e.g., a character turns out to be someone else, a physics-defying event, or a shocking reveal).
- Pacing: Fast, high-energy, no generic intros.

4. Output MUST be valid JSON fitting the provided schema.`;

  const response = await ai.models.generateContent({
    model,
    contents: `Topic for the story: ${topic}
    
Core Requirement:
- Technical Directives for Flow AI.
- Rigid character consistency via [CHARACTER_ANCHOR].
- Absolute speaker isolation via [SPEAKER_FOCUS] and [LISTENER_BEHAVIOR].
- High-tension viral hook (Scene 1).
- Unpredictable twist (Scene 3 or 4).`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          characterDefinitions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                visualIdentity: { type: Type.STRING },
              },
              required: ["name", "visualIdentity"],
            },
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                visualScript: { type: Type.STRING },
                audioScript: { type: Type.STRING },
                speaker: { type: Type.STRING },
              },
              required: ["sceneNumber", "visualScript", "audioScript", "speaker"],
            },
          },
        },
        required: ["title", "characterDefinitions", "scenes"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as ScriptResponse;
  } catch (e) {
    console.error("Failed to parse script response", e);
    throw new Error("Failed to generate script. Please try again.");
  }
}
