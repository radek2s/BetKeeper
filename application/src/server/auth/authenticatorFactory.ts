import type { AuthenticationProvider } from "./authentication.interface";
import { CorbadoAuthProvider } from "./providers/cobradoAuth";
import { ManualAuthProvider } from "./providers/manualAuth";

type AuthModeType = "CORBADO" | "MANUAL";

export const AUTH_MODE: AuthModeType = (process.env.NEXT_PUBLIC_AUTH_MODE ??
  "CORBADO") as AuthModeType;

export function getAuth(): AuthenticationProvider {
  switch (AUTH_MODE) {
    case "CORBADO":
      return CorbadoAuthProvider.provider;
    case "MANUAL":
      return ManualAuthProvider.provider;
    default:
      throw new Error(`AuthMode ${AUTH_MODE} is not yet supported!`);
  }
}
