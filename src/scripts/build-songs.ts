import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SongSchema } from "../lib/song.schema";

export async function buildSongs() {
  const dir = join(process.cwd(), "src/songs");
  const files = await readdir(dir);
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const content = await readFile(join(dir, file), "utf8");
    const data = JSON.parse(content);
    const song = SongSchema.parse(data);
    await writeFile(join(dir, file), JSON.stringify(song, null, 2));
  }
}

if (require.main === module) {
  buildSongs();
}
