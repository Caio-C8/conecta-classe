import { CreateUsuarioInput, CreateUsuarioSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const CreateUsuarioDto = createZodDto(CreateUsuarioSchema);

export type CreateUsuarioDto = CreateUsuarioInput;
