/** biome-ignore-all lint/suspicious/noShadowRestrictedNames: <explanation> */
"use client";

import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { useEffect } from "react";

type ErrorPageType = {
  error: Error & { digest?: string };
};
export default function Error({ error }: ErrorPageType) {
  useEffect(() => {
    console.log(error);
  }, [error]);
  return (
    <PageWrapper>
      <h1 className="my-4">Unexpeced error occured</h1>
      <p>{error.name}</p>
      <p>Error code: {error.digest}</p>
    </PageWrapper>
  );
}
