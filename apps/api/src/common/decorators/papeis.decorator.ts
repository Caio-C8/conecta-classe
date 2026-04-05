import { SetMetadata } from "@nestjs/common";
import { Papel } from "@repo/types";

export const PAPEL_KEY = "papel";

export const Papeis = (...papeis: Papel[]) => SetMetadata(PAPEL_KEY, papeis);
