import { v4 } from "uuid";

export const generateId = () => v4();

export type UUID = ReturnType<typeof generateId>;
