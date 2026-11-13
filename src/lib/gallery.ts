import type { ImageMetadata } from "astro"
import exifr from "exifr"
import { readFile } from "node:fs/promises"
import { basename, resolve } from "node:path"

export const sections = ["paintings", "watercolors", "portraits", "prints", "sculptures"] as const
export type Section = (typeof sections)[number]

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../../content/*/*.{jpg,jpeg,png}",
  { eager: true },
)

export async function getGallery(section: Section) {
  const folder = section[0].toUpperCase() + section.slice(1)
  const entries = Object.entries(imageModules)
    .filter(([path]) => path.includes(`/content/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))

  return Promise.all(entries.map(async ([path, image]) => {
    const file = resolve(process.cwd(), "content", folder, basename(path))
    const metadata = await exifr.parse(await readFile(file), { iptc: true }).catch(() => undefined)
    const title = String(metadata?.XPTitle || metadata?.Title || basename(path).replace(/^\d+-/, "").replace(/-[a-f0-9]{10}\.[^.]+$/, "").replaceAll("-", " "))
    const description = String(metadata?.ImageDescription || metadata?.Description || "")
    return { image: image.default, title, description }
  }))
}
