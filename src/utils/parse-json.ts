import { attempt, isError } from "lodash";

export const parseJSON = (str: string) => {
	const json = attempt(JSON.parse.bind(null, str));
	return isError(json) ? undefined : json;
};
