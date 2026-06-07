import { RegistrarNotasInput, RegistrarNotasSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const RegistrarNotasDto = createZodDto(RegistrarNotasSchema);

export type RegistrarNotasDto = RegistrarNotasInput;
