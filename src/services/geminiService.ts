import { GoogleGenAI, Type } from "@google/genai";

export interface Scene {
  sceneNumber: number;
  visualScript: string;
  audioScript: string;
}

export interface ScriptResponse {
  title: string;
  scenes: Scene[];
}

export async function generateHindiScript(topic: string, apiKey: string): Promise<ScriptResponse> {
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are an expert cartoon hindi script generator. 
Your scripting style follows these rules:
1. Provide the story in scene format (max 10 scenes).
2. For each scene, provide a visual script (English) and an audio script (Hindi).
3. Visual script MUST be in English language and English literals, make sure to describe visuals properly.
4. Audio script MUST be in Hindi language and Hindi literals, make sure the audio script MUST be written in hindi font only.
5. In the audio script mention who is the speaker for this dialogue.
6. Each script should have a one-liner dialogue only (10-12 words max).
7. The script should be funny, interactive, and contain local Indian slangs (e.g., 'bhai', 'mast', 'dhansu', 'arre yaar', 're').
8. Include a call to action in the final scene (like, follow, subscribe, comment).
9. The visual script should be a prompt suitable for a video generation model like Flow AI.
10. The first scene MUST open with a very strong hook that creates instant curiosity, surprise, tension, or a funny contradiction within the first 2 seconds.
11. Build the sequence for higher retention: every scene should create a new question, escalation, reveal, twist, or payoff so viewers want to keep watching.
12. Avoid slow intros, generic setup, repeated beats, filler lines, and weak exposition.
13. Keep the pacing fast and visual: the first 3 scenes should feel immediately engaging and scroll-stopping.
14. The final title should feel catchy, clickable, and emotionally charged, but not misleading.
15. Do not promise guaranteed virality or that the video will trend every time; instead optimize for stronger audience retention, shareability, and replay value.
16. Output MUST be valid JSON.`;

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a funny cartoon script about: ${topic}

Additional objective:
- Make the hook exceptionally strong for short-form video retention.
- Make scene 1 feel instantly attention-grabbing.
- Make scenes 2-4 escalate curiosity or comedy quickly.
- Make the ending feel satisfying and share-worthy.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                visualScript: { type: Type.STRING },
                audioScript: { type: Type.STRING },
              },
              required: ["sceneNumber", "visualScript", "audioScript"],
            },
          },
        },
        required: ["title", "scenes"],
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
