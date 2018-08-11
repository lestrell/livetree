import { random, times } from "lodash";

export interface IArrayFromRangeAndLimit {
  min: number;
  max: number;
  limit: number;
}

export const generateArrayFromRangeAndLimit = ({ min, max, limit }: IArrayFromRangeAndLimit) => {
  return times(limit, () => random(min, max));
}
