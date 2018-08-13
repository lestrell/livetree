import { expect } from "../../../test";
import { RedisService as redis } from './index';

describe("RedisService", () => {

	before(() => redis.init()); // if development, the database will be flushed everytime

	it("remove key", () => {
		redis.set("one", { key: "one", value: "valueOne"})
		.then( () => redis.get("one"))
		.then( (data: any) => expect(data.value).to.be.equal("valueOne"))
		.then( () => redis.remove("one") )
		.then( data => expect(data).to.be.equal(1) );
	});

	it("remove key", () => {
		redis.set("one", { key: "one", value: "valueOne"})
		.then( () => redis.get("one"))
		.then( (data: any) => expect(data.value).to.be.equal("valueOne"))
		.then( () => redis.remove("one1") )
		.then( data => expect(data).to.be.equal(0) );
	});

	it("Set/Get Many", (done: MochaDone) => {

		Promise.all([
			redis.set("one", { key: "one", value: "valueOne" }),
			redis.set("two", { key: "two", value: "valuetwo" }),
			redis.set("three", { key: "three", value: "valuethree" }),
			redis.set("four", { key: "four", value: "valuefour" }),
		])
		.then(() => redis.getAll())
		.then( (data) => {
			// console.log(JSON.stringify(data, null, 3));
			console.log("data:27", data);
			expect((data as any).length).to.be.equal(4);

			done();
		});
	});

	it("Set/Get string: positive", (done: MochaDone) => {
		// Arrange
		redis.set("key", "cool value")
			.then((data) => expect(data).to.be.equal("OK"))
			.then(() => redis.get("key")) // Act
			.then((data) => {

				// Assert
				expect(data).to.be.an("string");
				expect(data).to.be.equal("cool value");
				done();
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

		// Act
		redis.set(object.key, object)
			.then((data) => expect(data).to.be.equal("OK"))
			.then(() => redis.get(object.key))
			.then((data: any) => {
				// Assert
				// expect(data).to.be.an("string");
				// expect(data).to.be.equal(JSON.stringify(object));
				// const _object = JSON.parse(data);
				console.log(data);
				expect(data.versions[0]).to.be.equal("js");
				expect(data.versions[2]).to.be.equal(3);
				done();
			});

	});


});
