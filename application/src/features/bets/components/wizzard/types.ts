export type TermsResult = {
  title: string;
  description: string;
};

export type StakeResult =
  | {
      type: "common";
      stake: string;
    }
  | {
      type: "individual";
      userStake: string;
      friendStake: string;
    };

export type BetRequestCreate = {
  friendId: string;
} & TermsResult &
  StakeResult;

export function isTermsResult(result: object): result is TermsResult {
  return Object.hasOwn(result, "title");
}
