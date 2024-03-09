import fs from "fs/promises";

export async function readFile(fileUri: string): Promise<string> {
  try {
    const fileBuffer = await fs.readFile(fileUri);
    const fileSource = fileBuffer.toString();

    return fileSource;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
