import fsp from 'node:fs/promises';
import fg from 'fast-glob';
import { resolve, relative, join } from 'node:path/posix';
import { AssetType, AssetInfo } from '../types';

// const defaultAllowedExtensions = [
// const defaultAllowedExtensions = [
//   'png',
//   'jpg',
//   'jpeg',
//   'gif',
//   'svg',
//   'webp',
//   'ico',
//   'mp4',
//   'ogg',
//   'mp3',
//   'wav',
//   'mov',
//   'mkv',
//   'mpg',
//   'txt',
//   'ttf',
//   'woff',
//   'woff2',
//   'eot',
//   'json',
//   'js',
//   'jsx',
//   'ts',
//   'tsx',
//   'md',
//   'mdx',
//   'vue',
//   'webm',
// ];

function guessType(path: string): AssetType {
  if (/\.(?:png|jpe?g|jxl|gif|svg|webp|avif|ico|bmp|tiff?)$/i.test(path))
    return 'image';
  if (
    /\.(?:mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|ts|mts|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)$/i.test(
      path,
    )
  )
    return 'video';
  if (
    /\.(?:mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)$/i.test(
      path,
    )
  )
    return 'audio';
  if (/\.(?:woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)/i.test(path)) return 'font';
  if (
    /\.(?:json[5c]?|te?xt|[mc]?[jt]sx?|md[cx]?|markdown|ya?ml|toml)/i.test(path)
  )
    return 'text';
  if (/\.wasm/i.test(path)) return 'wasm';
  return 'other';
}

export function getAssetsFunctions(ctx: any) {
  const { config } = ctx;

  //   const _imageMetaCache = new Map<string, ImageMeta | undefined>();
  let cache: AssetInfo[] | null = null;

  async function getAssetsFromPublicDir() {
    const dir = resolve(config.root);
    const baseURL = config.base;

    // publicDir in ResolvedConfig is an absolute path
    const publicDir = config.publicDir;
    const relativePublicDir =
      publicDir === '' ? '' : `${relative(dir, publicDir)}/`;

    const files = await fg(
      [
        // image
        '**/*.(png|jpg|jpeg|gif|svg|webp|avif|ico|bmp|tiff)',
        // video
        '**/*.(mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)',
        // audio
        '**/*.(mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)',
        // font
        '**/*.(woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)',
        // text
        '**/*.(json|json5|jsonc|txt|text|tsx|jsx|md|mdx|mdc|markdown|yaml|yml|toml)',
        // wasm
        '**/*.wasm',
      ],
      {
        cwd: publicDir,
        onlyFiles: true,
        caseSensitiveMatch: false,
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          '**/package-lock.*',
          '**/pnpm-lock.*',
          '**/pnpm-workspace.*',
        ],
      },
    );

    cache = await Promise.all(
      files.map(async (relativePath) => {
        const filePath = resolve(publicDir, relativePath);
        const stat = await fsp.lstat(filePath);
        // remove public prefix to resolve vite assets warning
        const path = relativePath.replace(relativePublicDir, '');
        return {
          path,
          relativePath,
          publicPath: join(baseURL, path),
          filePath,
          type: guessType(relativePath),
          size: stat.size,
          mtime: stat.mtimeMs,
        };
      }),
    );
    return cache;
  }

  return {
    getAssetsFromPublicDir,
  };
}

// export async function getPublicDirFiles(dir: string) {
//   try {
//     const files = await fsp.readdir(dir);
//     return files.map((file) => {
//       const fullPath = join(dir, file);
//       const stats = fsp(fullPath);
//       return {
//         name: file,
//         path: fullPath,
//         isDirectory: stats.isDirectory(),
//         size: stats.size,
//       };
//     });
//   } catch (error) {
//     console.error('Error reading publicDir:', error);
//     return [];
//   }
// }
