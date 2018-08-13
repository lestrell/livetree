import { expect } from "../../../test";
import { IArrayFromRangeAndLimit, generateArrayFromRangeAndLimit } from './index';
import { filter, isNumber, max, min } from "lodash";
describe("generateArrayFromRangeAndLimit", () => {

    it("should an array of numbers based on the input", () => {

		// Arrange
		const opts: IArrayFromRangeAndLimit = {
			max: 1000,
			min: -1000,
			limit: 15
		};

		// Act
		const arr = generateArrayFromRangeAndLimit(opts);

		// Assert
		expect(arr).to.have.lengthOf(opts.limit);
		expect(filter(arr, x => isNumber(x))).to.have.lengthOf(opts.limit);
		expect(max(arr)).to.be.lessThan(opts.max + 1);
		expect(min(arr)).to.be.greaterThan(opts.min - 1);
	});

});
