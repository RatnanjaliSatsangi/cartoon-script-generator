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
  
  const systemInstruction = `You are an expert cartoon hindi script generator specialized in short-form viral videos (YouTube Shorts/Instagram Reels).
Your scripting style follows these rules:
1. Provide the story in exactly 5-10 scenes.
2. For each scene, provide a visual script (English) and an audio script (Hindi).
3. Visual script MUST be in English language and English literals, make sure to describe visuals properly.
4. Audio script MUST be in Hindi language and Hindi literals, make sure the audio script MUST be written in hindi font only.
5. In the audio script mention who is the speaker for this dialogue.
6. Each dialogue should be catchy and natural (10-12 words max).
7. Use funny, interactive tone with local Indian slangs (e.g., 'bhai', 'mast', 'dhansu', 'arre yaar', 're').

### Character Consistency (CRITICAL)
8. First, define 2-3 main characters with a fixed 'Visual Identity' (e.g., age, clothing color, hairstyle, special feature).
9. In every SINGLE 'visualScript' prompt, you MUST start by repeating the EXACT visual description for the character(s) present in that scene. FLOW AI needs this to keep characters consistent.

### Dialogue Attribution & Lip-Sync (CRITICAL)
10. The 'visualScript' prompt MUST explicitly state: "(Character Name) is speaking, focus on their face, mouth moving naturally to speak."
11. Other characters in the scene should be described as "listening", "reacting with surprise", or "looking at (Character Name)". This prevents the wrong character from lip-syncing.

### Viral Hook & Pacing
12. Scene 1 MUST be a 'Pattern Interrupt' or a 'Shocking Hook'. Start in the middle of a weird situation, or with a bold claim. 
13. Every scene must escalate the curiosity. Scene 3 or 4 MUST contain a 'Twist' or a 'Sudden Turn' that the viewer didn't expect.
14. Final scene must have a funny payoff or a punchline, followed by a call to action.

15. Visual Prompt Guidelines for Flow AI:
    - Use cinematic terms: "Close-up", "Extreme Close-up", "Low angle", "Dramatic lightning".
    - Avoid generic words; use descriptive ones.
    
16. Output MUST be valid JSON fitting the provided schema.`;

  const response = await ai.models.generateContent({
    model,
    contents: `Topic for the story: ${topic}
    
Objectives:
- Create a character-driven story with 2-3 distinct characters.
- Ensure character descriptions are detailed for visual consistency.
- Make the first 2 seconds (Scene 1) extremely hooky/viral.
- Include a major plot twist or funny surprise.
- Focus the camera on the speaker in every scene.`,
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
