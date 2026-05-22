import { GetTurmasInput, GetTurmasSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const GetTurmasDto = createZodDto(GetTurmasSchema);

export type GetTurmasDto = GetTurmasInput;
