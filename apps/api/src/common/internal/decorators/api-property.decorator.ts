import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export function ApiPropertyResource(options?: ApiPropertyOptions) {
  return applyDecorators(
    ApiProperty({
      ...options,
      description: '[Resource]',
    }),
  );
}

export function ApiPropertyBirthDate(options?: ApiPropertyOptions) {
  return applyDecorators(
    ApiProperty({
      ...options,
      description: 'BirthDate (YYYYMMDD)',
    }),
  );
}

export function ApiPropertyUpdateMask(options?: ApiPropertyOptions) {
  return applyDecorators(
    ApiProperty({
      ...options,
      description: `resource field 값중 변경원하는 값의 필드명을 ,로 구분하여 넣어주세요. <br/>
        resource에 값이 있어도 updateMask에서 확인되지않는 field는 수정 반영되지 않습니다.
        `,
    }),
  );
}
