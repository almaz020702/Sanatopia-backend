import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const UserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const userId: number = request.user.id;

    if (!userId) {
      return null;
    }

    return userId;
  },
);
