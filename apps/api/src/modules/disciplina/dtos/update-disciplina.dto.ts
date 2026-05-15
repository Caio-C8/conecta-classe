import { UpdateDisciplinaInput, UpdateDisciplinaSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const UpdateDisciplinaDto = createZodDto(UpdateDisciplinaSchema);

export type UpdateDisciplinaDto = UpdateDisciplinaInput;
