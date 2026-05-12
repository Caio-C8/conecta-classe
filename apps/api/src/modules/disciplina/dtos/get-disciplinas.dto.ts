import { GetDisciplinasInput, GetDisciplinasSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const GetDisciplinasDto = createZodDto(GetDisciplinasSchema);

export type GetDisciplinasDto = GetDisciplinasInput;
