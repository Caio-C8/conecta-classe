import { VincularAlunoInput, VincularAlunoSchema } from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const VincularAlunoDto = createZodDto(VincularAlunoSchema);

export type VincularAlunoDto = VincularAlunoInput;
