import { CreateEventoInput, CreateEventoSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const CreateEventoDto = createZodDto(CreateEventoSchema);

export type CreateEventoDto = CreateEventoInput;
