import { CreateDisciplinaInput, CreateDisciplinaSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const CreateDisciplinaDto = createZodDto(CreateDisciplinaSchema);

export type CreateDisciplinaDto = CreateDisciplinaInput;
