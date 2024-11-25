/**
 * hls 스트리밍 설정
 */
interface StreamingConfig {
  maxBufferLength: number;
  maxMaxBufferLength: number;
  maxBufferSize: number;
  maxBufferHole: number;
  lowLatencyMode: boolean;
  backBufferLength: number;
}
