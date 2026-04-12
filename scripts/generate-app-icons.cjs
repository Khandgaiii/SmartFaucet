const sharp = require("sharp")
const { existsSync } = require("fs")
const { mkdir, readFile, writeFile } = require("fs/promises")
const { join } = require("path")

const root = join(__dirname, "..")
const src = join(root, "public", "app-icon-source.png")
const publicDir = join(root, "public")
const androidRes = join(root, "android", "app", "src", "main", "res")

/** Matches adaptive icon background + splash family */
const BG = { r: 14, g: 165, b: 233 }

/** Optional raw art from project root (re-export overwrites normalized PNG) */
const RAW_ICON_JPG = join(root, "Gemini_Generated_Image_hpogszhpogszhpog.jpg")

/** Legacy launcher / mipmap densities */
const mipmaps = [
  { dir: "mipmap-mdpi", size: 48 },
  { dir: "mipmap-hdpi", size: 72 },
  { dir: "mipmap-xhdpi", size: 96 },
  { dir: "mipmap-xxhdpi", size: 144 },
  { dir: "mipmap-xxxhdpi", size: 192 },
]

/** Adaptive icon foreground (108dp) per density */
const foregroundDrawables = [
  { dir: "drawable-mdpi", size: 108 },
  { dir: "drawable-hdpi", size: 162 },
  { dir: "drawable-xhdpi", size: 216 },
  { dir: "drawable-xxhdpi", size: 324 },
  { dir: "drawable-xxxhdpi", size: 432 },
]

/**
 * Build a square master PNG: artwork centered on canvas (fixes off-center exports).
 * Uses contain + centre so nothing is cropped; pad uses brand blue if aspect ≠ 1:1.
 */
async function writeNormalizedMasterPng() {
  const inputPath = existsSync(RAW_ICON_JPG) ? RAW_ICON_JPG : src
  if (!existsSync(inputPath)) {
    throw new Error(
      `No icon source found. Add ${RAW_ICON_JPG} or public/app-icon-source.png`,
    )
  }

  await mkdir(publicDir, { recursive: true })

  await sharp(inputPath)
    .rotate()
    .resize(1024, 1024, {
      fit: "contain",
      position: "centre",
      background: BG,
    })
    .png()
    .toFile(src)
}

async function main() {
  await writeNormalizedMasterPng()

  const input = await readFile(src)

  await sharp(input).resize(192, 192).png().toFile(join(publicDir, "icon-192.png"))
  await sharp(input).resize(512, 512).png().toFile(join(publicDir, "icon-512.png"))
  await sharp(input).resize(32, 32).png().toFile(join(publicDir, "favicon-32.png"))

  for (const { dir, size } of mipmaps) {
    const outDir = join(androidRes, dir)
    await mkdir(outDir, { recursive: true })
    const png = await sharp(input).resize(size, size).png().toBuffer()
    await writeFile(join(outDir, "ic_launcher.png"), png)
    await writeFile(join(outDir, "ic_launcher_round.png"), png)
    await writeFile(join(outDir, "ic_launcher_foreground.png"), png)
  }

  for (const { dir, size } of foregroundDrawables) {
    const outDir = join(androidRes, dir)
    await mkdir(outDir, { recursive: true })
    await sharp(input)
      .resize(size, size)
      .png()
      .toFile(join(outDir, "ic_launcher_foreground.png"))
  }

  console.log(
    "App icons generated (centered 1024×1024 master → mipmaps & drawables).",
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
