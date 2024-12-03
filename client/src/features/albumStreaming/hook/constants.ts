/**
 * hls 스트리밍 기본 설정
 */
export const DEFAULT_STREAMING_CONFIG: StreamingConfig = {
  maxBufferLength: 30,
  maxMaxBufferLength: 60,
  maxBufferSize: 0,
  maxBufferHole: 0,
  lowLatencyMode: true,
  backBufferLength: 0,
};
