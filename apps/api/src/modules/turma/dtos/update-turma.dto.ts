import { UpdateTurmaInput, UpdateTurmaSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const UpdateTurmaDto = createZodDto(UpdateTurmaSchema);

export type UpdateTurmaDto = UpdateTurmaInput;
