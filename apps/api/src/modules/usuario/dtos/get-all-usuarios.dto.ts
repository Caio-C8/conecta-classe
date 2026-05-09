import { GetUsuariosInput, GetUsuariosSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const GetAllUsuarioDto = createZodDto(GetUsuariosSchema);

export type GetAllUsuarioDto = GetUsuariosInput;
