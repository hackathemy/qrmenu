import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function Public() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description:
        '비회원도 요청 가능 (specific column의 값을 얻고싶은 경우 입력) "Bearer {token}"',
    }),
    SetMetadata('auth', false),
  );
}
