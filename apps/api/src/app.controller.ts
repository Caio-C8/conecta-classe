import { Controller, Get } from "@nestjs/common";
import { Publico } from "./common/decorators/publico.decorator";

@Controller()
export class AppController {
  constructor() {}

  @Publico()
  @Get()
  getHello(): string {
    return "API funcionando";
  }
}
