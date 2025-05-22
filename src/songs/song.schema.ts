import { PITCHES } from "@/features/keyboard/pitches";
import { z } from "zod";

export const Pitch = z.enum(PITCHES);
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
    emoji: z.string(),
    bpm: z.number(),
    timeSig: z.tuple([z.number(), z.number()]),
  }),
  notes: z.array(NoteSchema),
});
export type Song = z.infer<typeof SongSchema>;
