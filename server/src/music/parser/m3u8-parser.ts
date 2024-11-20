import { Injectable } from '@nestjs/common';

@Injectable()
export class M3U8Parser {
  parse(content: string, skipSegments: number): string {
    const lines = content.split('\n');
    let segmentCount = 0;
    
    return lines
      .map(line => {
        if (!line) return null;
        
        if (line.startsWith('#EXT-X-MEDIA-SEQUENCE')) {
          return `#EXT-X-MEDIA-SEQUENCE:${skipSegments}`;
        }

        if (line.startsWith('#EXTINF') || (!line.startsWith('#') && line)) {
          const shouldInclude = segmentCount >= skipSegments;
          if (!line.startsWith('#')) segmentCount++;
          return shouldInclude ? line : null;
        }

        return line;
      })
      .filter((line): line is string => line !== null)
      .join('\n') + '\n';
  }
}
