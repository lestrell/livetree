import { app, chai, expect, mocha } from "../../../test";
import { RedisService } from './index';

describe("RedisService", () => {

	before( () => RedisService.init() );

	it("Set/Get Many", (done: MochaDone) => {

		RedisService.set("one", { key: "one", value: "valueOne" }, () => {});
		RedisService.set("two", { key: "two", value: "valuetwo" }, () => {});
		RedisService.set("three", { key: "three", value: "valuethree" }, () => {});
		RedisService.set("four", { key: "four", value: "valuefour" }, () => {});

		setTimeout( () => {
			// RedisService._redis.keys("*", (error, data: any) => {
			// 	console.log("*", error, data);
			// });
			RedisService._redis.get("*", (error, data: any) => {
				console.log("*", error, data);
				console.log(RedisService._redis);
			});

			done();
		}, 2000);
	});

	it("Set/Get string: positive", (done: MochaDone) => {
		// Arrange
		RedisService.set("key", "cool value", (errorSet: any, dataSet) => {
			console.log("errorSet", errorSet);
			console.log("dataSet", dataSet);
			expect(dataSet).to.be.equal("OK");

			// Act
			RedisService.get("key", (getError, getData: any) => {
				console.log("getError", getError);
				console.log("getData", getData);
				expect(getData).to.be.an("string");
				expect(getData).to.be.equal("cool value");
				done();
			});


		});

	});

	it("Set/Get obj: positive", (done: MochaDone) => {
		// Arrange
		const object = {
			created: Date.now(),
			modified: Date.now(),
			key: "angular",
			versions: [
				"js", 2, 3, 4, 5, 6
			]
		};
		RedisService.set(object.key, object, (errorSet: any, dataSet) => {
			console.log("errorSet", errorSet);
			console.log("dataSet", dataSet);
			expect(errorSet).to.be.null;
			expect(dataSet).to.be.equal("OK");

			// Act
			RedisService.get(object.key, (getError, getData: any) => {
				console.log("getError", getError);
				console.log("getData", getData);
				expect(getError).to.be.null;

				// Assert
				expect(getData).to.be.an("string");
				expect(getData).to.be.equal(JSON.stringify(object));
				const _object = JSON.parse(getData);
				expect(_object.versions[0]).to.be.equal("js");
				expect(object.versions[2]).to.be.equal(3);
				done();
			});


		});

	});


});
