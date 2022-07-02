import BN from "bn.js";

export type NominatorTargetsType = {
  submittedIn: number;
  suppressed: boolean;
  targets: string[];
};

export type ValidatorStakersType = { value: string; who: string }[];

export type EraValidatorStakersType = {
  others: ValidatorStakersType;
  own: string;
  total: string;
};

export interface IRewardsData {
  firstTimestamp: string;
  total: BN;
}
