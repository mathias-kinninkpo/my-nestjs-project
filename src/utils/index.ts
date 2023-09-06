import { extname } from "path";

export function generateUniqueFilename(filename) {
  const randomBytes =  Math.round(Math.random() * 1e9)
  const timestamp = Date.now();
  return `${filename}${timestamp}${randomBytes}${extname(filename)}`;
}