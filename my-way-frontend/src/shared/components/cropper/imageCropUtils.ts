import type { Area } from "react-easy-crop";

function createImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = source;
  });
}

export async function getCroppedSquareDataUrl(
  imageSrc: string,
  cropPixels: Area,
  outputSize = 256,
): Promise<string> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context is not available");
  }

  canvas.width = outputSize;
  canvas.height = outputSize;

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outputSize,
    outputSize,
  );

  return canvas.toDataURL("image/jpeg", 0.9);
}
