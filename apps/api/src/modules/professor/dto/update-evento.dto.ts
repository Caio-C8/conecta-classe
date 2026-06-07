import { UpdateEventoInput, UpdateEventoSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const UpdateEventoDto = createZodDto(UpdateEventoSchema);

export type UpdateEventoDto = UpdateEventoInput;
