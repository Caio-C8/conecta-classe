import { Controller, Post } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { Publico } from "../../common/decorators/publico.decorator";

@Controller("seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Publico()
  @Post("popular")
  async popularBanco() {
    await this.seedService.popularBanco();
    return { mensagem: "Banco populado com sucesso com dados de escola real." };
  }

  @Publico()
  @Post("limpar")
  async limparBanco() {
    await this.seedService.limparBanco();
    return {
      mensagem: "Banco limpo com sucesso e usuário admin padrão recriado.",
    };
  }
}
