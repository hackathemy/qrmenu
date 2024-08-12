import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorObject } from 'src/common/error';

export function ApiErrorResponse(...schemas: ErrorObject[]) {
  return applyDecorators(
    ApiResponse({
      status: schemas[0].status,
      content: {
        'application/json': {
          examples: schemas.reduce((list, schema) => {
            list[schema.message] = { value: schema };
            return list;
          }, {}),
        },
      },
    }),
  );
}
