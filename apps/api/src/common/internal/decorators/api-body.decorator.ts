import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiBodyOptions } from '@nestjs/swagger';

export function ApiBodyUpdateResource(
  options: ApiBodyOptions & {
    updateableField: {
      [key in string]: string;
    };
  },
) {
  return applyDecorators(
    ApiBody({
      ...options,
      description:
        '[Updateable Fields] <br/>' +
        Object.values(options.updateableField)
          .map((x) => ' - ' + x)
          .join('<br />'),
    }),
  );
}
