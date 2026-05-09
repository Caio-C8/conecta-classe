import { UpdateUsuarioInput, UpdateUsuarioSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const UpdateUsuarioDto = createZodDto(UpdateUsuarioSchema);

export type UpdateUsuarioDto = UpdateUsuarioInput;
