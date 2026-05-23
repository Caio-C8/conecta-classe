import {
  VincularEDesvincularProfessorInput,
  VincularEDesvincularProfessorSchema,
} from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const VincularEDesvincularProfessorDto = createZodDto(
  VincularEDesvincularProfessorSchema,
);

export type VincularEDesvincularProfessorDto =
  VincularEDesvincularProfessorInput;
