// src/auth/guards/user-restrict.guard.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserRestrictGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // The userId from the JWT token
    const userIdFromRequest = request.user?.payload?.userId;
    console.log('User id req', request?.user);
    // The userId from the route parameter (e.g., /user/:userId)
    const resourceOwnerId = request.params.userId;
    console.log('Resource owner', resourceOwnerId);

    // Check if the user is allowed to access this resource
    if (userIdFromRequest !== resourceOwnerId) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true; // If the user is authorized, proceed with the request
  }
}
