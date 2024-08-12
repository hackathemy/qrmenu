import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetAccountRequestParamDto,
  GetAccountResponseDto,
} from './dtos/get-account.dto';
import {
  PatchAccountRequestBodyDto,
  PatchAccountRequestParamDto,
  PatchAccountResponseDto,
} from './dtos/patch-account.dto';
import { ApiErrorResponse } from 'src/common/error/decorators/api-error-response.decorator';
import { AccountsError } from './accounts.error';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  SignInWithEmailRequestBodyDto,
  SignInWithEmailResponseDto,
} from './dtos/sign-in-with-email.dto';
import {
  SignUpWithEmailRequestBodyDto,
  SignUpWithEmailResponseDto,
} from './dtos/sign-up-with-email.dto';
import {
  DeleteAccountReqeustBodyDto,
  DeleteAccountRequestParamDto,
} from './dtos/delete-account.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import {
  DeleteAccountCommand,
  PatchAccountCommand,
  RefreshTokenCommand,
  SignInWithEmailCommand,
  SignUpWithEmailCommand,
  UpdatePasswordCommand,
} from './commands';
import { ApiBodyUpdateResource } from 'src/common/internal/decorators/api-body.decorator';
import { UpdateableField } from './types';
import {
  RefreshTokenRequestBodyDto,
  RefreshTokenResponseDto,
} from './dtos/refresh-token.dto';
import {
  UpdatePasswordRequestBodyDto,
  UpdatePasswordRequestParamDto,
  UpdatePasswordResponseDto,
} from './dtos/update-password.dto';
import { ExistRequestBodyDto } from './dtos/exist.dto';
import { AccountsService } from './accounts.service';

@Controller()
@ApiTags('Account API')
export class AccountsController {
  constructor(
    private commandBus: CommandBus,
    private accountsService: AccountsService,
  ) {}

  @Post('/accounts[:]exist')
  @ApiOperation({
    summary: 'Exist ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
  })
  exist(@Body() body: ExistRequestBodyDto) {
    return this.accountsService.exist(body.email);
  }

  @Post('/accounts[:]refreshToken')
  @ApiOperation({
    summary: 'Refresh Token ',
    description: `[Note] <br/>
    * refreshToken으로 token pair 재발행`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RefreshTokenResponseDto,
  })
  refreshToken(@Body() body: RefreshTokenRequestBodyDto) {
    return this.commandBus.execute(new RefreshTokenCommand({ ...body }));
  }

  @Post('/accounts[:]signUpWithEmail')
  @ApiOperation({
    summary: 'Sign Up With Email ',
    description: `[Note] <br/>
    * 가입 성공 시 입력된 이메일로 인증 링크가 발송됨`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignUpWithEmailResponseDto,
  })
  signUpWithEmail(@Body() body: SignUpWithEmailRequestBodyDto) {
    return this.commandBus.execute(new SignUpWithEmailCommand({ ...body }));
  }

  @Post('/accounts[:]signInWithEmail')
  @ApiOperation({
    summary: 'Sign In With Email ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignInWithEmailResponseDto,
  })
  signInWithEmail(@Body() body: SignInWithEmailRequestBodyDto) {
    return this.commandBus.execute(new SignInWithEmailCommand({ ...body }));
  }

  @Post('/accounts/:accountId[:]updatePassword')
  @Auth()
  @ApiOperation({
    summary: 'Update Password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdatePasswordResponseDto,
  })
  updatePassword(
    @Param() param: UpdatePasswordRequestParamDto,
    @Body() body: UpdatePasswordRequestBodyDto,
    @RequestUser() requestUser,
  ) {
    return this.commandBus.execute(
      new UpdatePasswordCommand({ ...param, ...body }, requestUser),
    );
  }

  @Post('/accounts/:accountId[:]delete')
  @Auth()
  @ApiOperation({
    summary: 'Delete Account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleted Account',
  })
  deleteAccount(
    @Param() param: DeleteAccountRequestParamDto,
    @Body() body: DeleteAccountReqeustBodyDto,
    @RequestUser() requestUser,
  ) {
    return this.commandBus.execute(
      new DeleteAccountCommand({ ...param, ...body }, requestUser),
    );
  }

  @Patch('/accounts/:accountId')
  @Auth()
  @ApiOperation({
    summary: 'Patch Account ',
  })
  @ApiBodyUpdateResource({
    type: PatchAccountRequestBodyDto,
    updateableField: UpdateableField,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PatchAccountResponseDto,
  })
  @ApiErrorResponse(AccountsError.CONFLICT_USERNAME)
  patchAccount(
    @Param() param: PatchAccountRequestParamDto,
    @Body() body: PatchAccountRequestBodyDto,
    @RequestUser() requestUser,
  ) {
    return this.commandBus.execute(
      new PatchAccountCommand({ ...body, ...param }, requestUser),
    );
  }

  @Get('/accounts/:accountId')
  @Auth()
  @ApiOperation({
    summary: 'Get Account ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAccountResponseDto,
  })
  getAccount(
    @Param() param: GetAccountRequestParamDto,
    @RequestUser() requestUser,
  ) {
    return this.accountsService.getAccount(param, requestUser);
  }
}
