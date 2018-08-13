import { includes, lowerCase, map } from 'lodash';
export const includesIgnoreCase = (arr: string[], str: string = "") => includes(map(arr, lowerCase), lowerCase(str));
