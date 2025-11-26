export type TermsResult = {
  title: string;
  description?: string;
};

export function isTermsResult(result: object): result is TermsResult {
  return Object.hasOwn(result, "title");
}
