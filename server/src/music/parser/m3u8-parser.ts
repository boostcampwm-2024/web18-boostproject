import { Injectable } from '@nestjs/common';

@Injectable()
export class M3U8Parser {
  parse(
    content: string,
    skipSegments: number,
    albumId: string,
    songIndex: string,
  ): string {
    const lines = content.split('\n');
    let segmentCount = 0;

    return (
      lines
        .map((line) => {
          if (!line) return null;

          if (line.startsWith('#EXT-X-MEDIA-SEQUENCE')) {
            return `#EXT-X-MEDIA-SEQUENCE:${skipSegments}`;
          }

          if (line.startsWith('#EXTINF') || (!line.startsWith('#') && line)) {
            const shouldInclude = segmentCount >= skipSegments;
            if (!line.startsWith('#')) {
              const segmentNumber = line.match(/playlist(\d+)\.ts/)?.[1];
              segmentCount++;

              if (shouldInclude && segmentNumber) {
                return `/api/music/${albumId}/${songIndex}/playlist${segmentNumber}.ts`;
              }
              return null;
            }
            return shouldInclude ? line : null;
          }

          return line;
        })
        .filter((line): line is string => line !== null)
        .join('\n') + '\n'
    );
  }
}
