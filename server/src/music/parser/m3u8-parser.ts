import { Injectable } from '@nestjs/common';

@Injectable()
export class M3U8Parser {
  parse(content: string, skipSegments: number): string {
    const lines = content.split('\n');
    let modifiedM3u8 = '';
    let isSegment = false;
    let segmentCount = 0;

    for (const line of lines) {
      if (this.isExtInf(line)) {
        isSegment = true;
        if (segmentCount >= skipSegments) {
          modifiedM3u8 += line + '\n';
        }
      } else if (isSegment) {
        isSegment = false;
        if (segmentCount >= skipSegments) {
          modifiedM3u8 += line + '\n';
        }
        segmentCount++;
      } else if (this.isMetadataLine(line)) {
        modifiedM3u8 += this.processMetadataLine(line, skipSegments) + '\n';
      } else if (line.trim() !== '') {
        modifiedM3u8 += line + '\n';
      }
    }

    return modifiedM3u8;
  }

  private isExtInf(line: string): boolean {
    return line.startsWith('#EXTINF:');
  }

  private isMetadataLine(line: string): boolean {
    return (
      line.startsWith('#EXT-X-TARGETDURATION') ||
      line.startsWith('#EXT-X-VERSION') ||
      line.startsWith('#EXT-X-MEDIA-SEQUENCE')
    );
  }

  private processMetadataLine(line: string, skipSegments: number): string {
    if (line.startsWith('#EXT-X-MEDIA-SEQUENCE')) {
      return `#EXT-X-MEDIA-SEQUENCE:${skipSegments}`;
    }
    return line;
  }
}
