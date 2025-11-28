import { CommonStake, IndividualStakes, type IStake } from "@domain/bet";

export type BetRequestEntityType = {
  id: string;
  creatorId: string;
  participantId: string;
  title: string;
  terms: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  stakeType: string;
  stakeBase: string;
  stakeAdditional: string | null;
};

export type VoteEntityType = {
  requestId: string;
  participantId: string;
  vote: string;
  votedAt?: Date | null;
};

export type StakeRaw = Pick<
  BetRequestEntityType,
  "stakeType" | "stakeBase" | "stakeAdditional"
>;

export function getRawStakes(stakes?: IStake): StakeRaw {
  if (!stakes) throw new Error("Stake is not defined");
  if (stakes instanceof CommonStake) {
    return {
      stakeType: "common",
      stakeBase: stakes.description,
      stakeAdditional: null,
    };
  } else if (stakes instanceof IndividualStakes) {
    return {
      stakeType: "individual",
      stakeBase: stakes.creatorStake,
      stakeAdditional: stakes.participantStake,
    };
  } else {
    throw new Error("Unsupported stake type!");
  }
}

export function reconstituteStake(entity: StakeRaw) {
  return entity.stakeType === "common"
    ? new CommonStake(entity.stakeBase)
    : // biome-ignore lint/style/noNonNullAssertion: Indivudual stake always has second param
      // biome-ignore lint/suspicious/noExtraNonNullAssertion: Allways not null
      new IndividualStakes(entity.stakeBase, entity.stakeAdditional!!);
}
