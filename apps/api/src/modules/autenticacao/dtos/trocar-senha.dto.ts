import { TrocarSenhaSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export class TrocarSenhaDto extends createZodDto(TrocarSenhaSchema) {}
