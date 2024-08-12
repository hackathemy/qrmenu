export { CreateFileCommand } from './create-file.command';
export { GenerateSignedUrlCommand } from './generate-signed-url.command';

import { CreateFileCommandHandler } from './create-file.command';
import { GenerateSignedUrlCommandHandler } from './generate-signed-url.command';

export const COMMAND_HANDLERS = [
  CreateFileCommandHandler,
  GenerateSignedUrlCommandHandler,
];
