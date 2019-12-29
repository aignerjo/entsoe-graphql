import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

    @Get('/health')
    getHealth(): Date {
        return new Date();
    }
}
