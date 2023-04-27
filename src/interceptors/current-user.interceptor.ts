import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (request.currentUser) {
      //const userId = request.currentUser['sub'];
      // Reemplazar por GET svc-users
      //const user = await this.userService.findOne(userId);
      //request.currentUser = user;
    }

    return handler.handle();
  }
}
