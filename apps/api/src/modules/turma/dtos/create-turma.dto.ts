import { CreateTurmaInput, CreateTurmaSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const CreateTurmaDto = createZodDto(CreateTurmaSchema);

export type CreateTurmaDto = CreateTurmaInput;
