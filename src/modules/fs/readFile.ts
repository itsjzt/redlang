import fs from "fs/promises";
import path from "path";

export async function readFile(fileUri: string): Promise<string> {
  try {
    const fileBuffer = await fs.readFile(path.join(process.cwd(), fileUri));
    const fileSource = fileBuffer.toString();

    return fileSource;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
