import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello to Catologing API! I\'m ready to serve your requests';
  }
}
