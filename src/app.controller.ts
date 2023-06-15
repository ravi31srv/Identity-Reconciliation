/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { identificationDto } from './dtos/identification.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): Promise<any> {
    return this.appService.getHello();
  }


  @Post('/identify')
  identify(@Body() identificationBody: identificationDto): Promise<any> {
    return this.appService.identifyService(identificationBody)


  }

}
