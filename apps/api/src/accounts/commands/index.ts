import { DeleteAccountCommandHandler } from './delete-account.command';
import { PatchAccountCommandHandler } from './patch-account.command';
import { RefreshTokenCommandHandler } from './refresh-token.command';
import { SignInWithEmailCommandHandler } from './sign-in-with-email.command';
import { SignUpWithEmailCommandHandler } from './sign-up-with-email.command';
import { UpdatePasswordCommandHandler } from './update-password.command';
export { UpdatePasswordCommand } from './update-password.command';
export { DeleteAccountCommand } from './delete-account.command';
export { PatchAccountCommand } from './patch-account.command';
export { SignInWithEmailCommand } from './sign-in-with-email.command';
export { SignUpWithEmailCommand } from './sign-up-with-email.command';
export { RefreshTokenCommand } from './refresh-token.command';

export const COMMAND_HANDLERS = [
  DeleteAccountCommandHandler,
  PatchAccountCommandHandler,
  UpdatePasswordCommandHandler,
  SignInWithEmailCommandHandler,
  SignUpWithEmailCommandHandler,
  RefreshTokenCommandHandler,
];
