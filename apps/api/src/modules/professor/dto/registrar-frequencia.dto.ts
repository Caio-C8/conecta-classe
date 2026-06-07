import {
  RegistrarFrequenciaInput,
  RegistrarFrequenciaSchema,
} from "@repo/types";
import { createZodDto } from "nestjs-zod";

export const RegistrarFrequenciaDto = createZodDto(RegistrarFrequenciaSchema);

export type RegistrarFrequenciaDto = RegistrarFrequenciaInput;
