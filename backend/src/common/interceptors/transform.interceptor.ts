import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((result) => {
        // If result is already structured with success field
        if (result && typeof result === 'object' && 'success' in result && 'data' in result) {
          return result;
        }

        let message = 'Operation successful';
        let data = result;

        if (result && typeof result === 'object' && 'message' in result && 'data' in result) {
          message = result.message;
          data = result.data;
        } else if (result && typeof result === 'object' && 'message' in result) {
          message = result.message;
        }

        return {
          success: true,
          data,
          message,
        };
      }),
    );
  }
}
