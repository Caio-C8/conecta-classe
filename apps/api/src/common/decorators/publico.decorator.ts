import { SetMetadata } from "@nestjs/common";

export const IS_PUBLICO_KEY = "isPublic";

export const Publico = () => SetMetadata(IS_PUBLICO_KEY, true);
