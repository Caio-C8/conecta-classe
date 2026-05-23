import { VincularProfessorInput, VincularProfessorSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const VincularProfessorDto = createZodDto(VincularProfessorSchema);

export type VincularProfessorDto = VincularProfessorInput;
