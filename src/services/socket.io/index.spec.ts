import { isEmpty } from 'lodash';
import { IEditReturnFactory } from './../../types/edit-return-factory';
import * as http from "http";
import * as io from "socket.io-client";

import { RedisService as redis } from '../redis/index';

import { INewFactory } from '../../types/new-factory';
import { expect } from "../../../test"
import { IEditFactory } from '../../../client/src/types/edit-factory';
;
describe("SocketIOService", () => {

	let server;

	// using this options is the only way(so far ) to be able to test socket.io ( at least with the test suite )
	const options: any = {
		"reconnection delay": 0, "reopen delay": 0, "force new connection": true
	};
	let client: SocketIOClient.Socket;

	beforeEach((done: MochaDone) => {
		// start the server
		server = require("../../server");
		if (client) {
			client.removeAllListeners();
			client.disconnect();
		}
		client = io.connect("http://localhost:3000", options);

		// this ensures refresh_data gets triggers
		client.on("refresh_data", (data: any) => {
			done();
		});

	});

	// it("refresh_data: empty", function (done: MochaDone) {
	// 	this.timeout(5000);

	// 	// Arrange
	// 	// const client = io.connect("http://localhost:3000", options);
	// 	client.disconnect();
	// 	client = io.connect("http://localhost:3000", options);
	// 	client.on("refresh_data", (data: any) => {
	// 		console.log("on refresh_data: empty", data);
	// 		expect(isEmpty(data)).to.be.true;
	// 		done();
	// 	});
	// });

	it("refresh_data: not empty", function (done: MochaDone) {
		this.timeout(5000);

		Promise.all([
			redis.set("one", { key: "one", value: "valueOne" }),
			redis.set("two", { key: "two", value: "valuetwo" }),
			redis.set("three", { key: "three", value: "valuethree" }),
			redis.set("four", { key: "four", value: "valuefour" }),
		])
			.then(() => {

				// Arrange
				client.disconnect();
				client = io.connect("http://localhost:3000", options);
				client.once("refresh_data", (data: any) => {
					console.log("on refresh_data: not empty", data);

					// Assert
					expect(isEmpty(data)).to.be.false;
					done();
				});
			})
	});

	it("new_factory", function (done: MochaDone) {
		this.timeout(30000);

		// Arrange
		const newFactory: INewFactory = { key: "new_factory_test" };


		client.on("new_factory", (socketIOValue: INewFactory) => {

			redis.get(newFactory.key).then((redisValue: INewFactory) => {
				console.log("redisValue", redisValue);

				// Assert
				expect(redisValue.key).to.be.equal(newFactory.key);
				expect(socketIOValue.key).to.be.equal(newFactory.key);

				done();
			});

		});

		console.log("connect: it('new_factory)");


		// Act
		client.emit("new_factory", newFactory);

	});

	it("edit_factory", function (done: MochaDone) {
		this.timeout(30000);

		// Arrange
		// const client = io.connect("http://localhost:3000", options);
		const editFactory: IEditFactory = {
			key: "edit_factory_test",
			min: -50,
			max: 50,
			limit: 15
		};

		client.on("edit_factory", (socketIOValue: IEditFactory) => {
			console.log("edit_factory: it('edit_factory)");

			redis.get(editFactory.key).then( (redisValue: IEditReturnFactory) => {

				// Assert
				expect(redisValue.key).to.be.equal(editFactory.key);
				expect(socketIOValue.key).to.be.equal(editFactory.key);
				expect(redisValue.children).to.be.an("array");
				expect(redisValue.children).to.be.lengthOf(editFactory.limit);

				done();
			})
			.catch( (error) => {
				console.log(error);
				done(error);
			});

		});

		// setTimeout(() => {
		// 	console.log("Hey :)")
		// 	client.emit("edit_factory", editFactory);
		// }, 2000)
		client.emit("edit_factory", editFactory);

	});

});
