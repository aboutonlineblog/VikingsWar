export interface AppIconImage {
  idiom: string;
  scale: string;
  size: string;
  filename?: string;
}

export interface AppIconContents {
  images: AppIconImage[];
}

function hasSlot(
  contents: AppIconContents,
  idiom: string,
  size: string,
  scale: string,
): boolean {
  return contents.images.some(
    (image) =>
      image.idiom === idiom &&
      image.size === size &&
      image.scale === scale &&
      Boolean(image.filename),
  );
}

export function hasIpadAppIcons(contents: AppIconContents): boolean {
  return (
    hasSlot(contents, 'ipad', '76x76', '1x') &&
    hasSlot(contents, 'ipad', '76x76', '2x') &&
    hasSlot(contents, 'ipad', '83.5x83.5', '2x')
  );
}

export function hasMarketingIcon(contents: AppIconContents): boolean {
  return hasSlot(contents, 'ios-marketing', '1024x1024', '1x');
}

export function referencedIconFiles(contents: AppIconContents): string[] {
  const names = contents.images
    .map((image) => image.filename)
    .filter((filename): filename is string => Boolean(filename));
  return [...new Set(names)];
}

export function missingAppIconFiles(
  contents: AppIconContents,
  fileExists: (filename: string) => boolean,
): string[] {
  return referencedIconFiles(contents).filter((filename) => !fileExists(filename));
}
