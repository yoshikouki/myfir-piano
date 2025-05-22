import { z } from "zod";

export const Pitch = z.enum([
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
]);
export type Pitch = z.infer<typeof Pitch>;

export const NoteSchema = z.object({
  pitch: Pitch,
  duration: z.number(),
  lyric: z.string().optional(),
});

export const SongSchema = z.object({
  meta: z.object({
    id: z.string(),
    titleJp: z.string(),
    titleEn: z.string().optional(),
    bpm: z.number(),
    timeSig: z.tuple([z.number(), z.number()]),
  }),
  notes: z.array(NoteSchema),
});
export type Song = z.infer<typeof SongSchema>;
