import {
  hasIpadAppIcons,
  hasMarketingIcon,
  missingAppIconFiles,
  referencedIconFiles,
  type AppIconContents,
} from './appIconCatalog';

declare const __dirname: string;

const fs = require('fs') as {
  existsSync: (filePath: string) => boolean;
  readFileSync: (filePath: string, encoding: 'utf8') => string;
};
const path = require('path') as {
  join: (...parts: string[]) => string;
};

const ICONSET = path.join(
  __dirname,
  '../../ios/VikingsWar/Images.xcassets/AppIcon.appiconset',
);

function loadContents(): AppIconContents {
  return JSON.parse(
    fs.readFileSync(path.join(ICONSET, 'Contents.json'), 'utf8'),
  ) as AppIconContents;
}

describe('app icon catalog', () => {
  const empty: AppIconContents = { images: [] };

  it('requires iPad 76 and 83.5 slots with filenames', () => {
    expect(hasIpadAppIcons(empty)).toBe(false);
    expect(
      hasIpadAppIcons({
        images: [
          { idiom: 'ipad', scale: '1x', size: '76x76', filename: 'Icon-76.png' },
          { idiom: 'ipad', scale: '2x', size: '76x76', filename: 'Icon-152.png' },
          {
            idiom: 'ipad',
            scale: '2x',
            size: '83.5x83.5',
            filename: 'Icon-167.png',
          },
        ],
      }),
    ).toBe(true);
  });

  it('requires the 1024 App Store marketing icon', () => {
    expect(hasMarketingIcon(empty)).toBe(false);
    expect(
      hasMarketingIcon({
        images: [
          {
            idiom: 'ios-marketing',
            scale: '1x',
            size: '1024x1024',
            filename: 'Icon-1024.png',
          },
        ],
      }),
    ).toBe(true);
  });

  it('reports missing referenced files', () => {
    const contents: AppIconContents = {
      images: [
        { idiom: 'ipad', scale: '1x', size: '76x76', filename: 'Icon-76.png' },
        { idiom: 'ipad', scale: '2x', size: '76x76', filename: 'Icon-152.png' },
      ],
    };
    expect(referencedIconFiles(contents)).toEqual(['Icon-76.png', 'Icon-152.png']);
    expect(
      missingAppIconFiles(contents, (filename) => filename === 'Icon-76.png'),
    ).toEqual(['Icon-152.png']);
  });

  it('ships iPad and marketing icons with files on disk', () => {
    const contents = loadContents();
    expect(hasIpadAppIcons(contents)).toBe(true);
    expect(hasMarketingIcon(contents)).toBe(true);
    expect(missingAppIconFiles(contents, (filename) => fs.existsSync(path.join(ICONSET, filename)))).toEqual(
      [],
    );
  });
});
