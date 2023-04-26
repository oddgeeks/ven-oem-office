export interface IFilesConverter {
  bufferToStream: (file: Buffer) => Promise<NodeJS.ReadableStream>;
  streamToBuffer: (stream: NodeJS.ReadableStream) => Promise<Buffer>;
  fileToStream: (stream) => Promise<NodeJS.ReadableStream>;
}
