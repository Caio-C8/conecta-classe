import {
  VincularEDesvincularAlunoInput,
  VincularEDesvincularAlunoSchema,
} from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const VincularEDesvincularAlunoDto = createZodDto(
  VincularEDesvincularAlunoSchema,
);

export type VincularEDesvincularAlunoDto = VincularEDesvincularAlunoInput;
