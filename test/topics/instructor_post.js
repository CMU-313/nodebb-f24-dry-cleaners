'use strict';

const { title } = require('process');
const assert = require('assert');
const nconf = require('nconf');
const db = require('../mocks/databasemock');
const user = require('../../src/user');
const topics = require('../../src/topics');
const groups = require('../../src/groups');
const posts = require('../../src/posts');
const categories = require('../../src/categories');

describe('Topics.hasInstructorPosts', () => {
	let adminUid;
	let instructorUid;
	let regularUserUid;
	let categoryObj;
	let topicObj;
	let topicObj2;

	before(async () => {
		// Create users
		adminUid = await user.create({ username: 'admin', password: 'adminpass' });
		instructorUid = await user.create({ username: 'instructor', password: 'instructorpass' });
		regularUserUid = await user.create({ username: 'regularUser', password: 'userpass' });

		// Assign instructor to the group
		await groups.join('instructor', instructorUid);

		// Create a category and a topic (main post)
		categoryObj = await categories.create({
			title: 'Test Category',
			description: 'Test category for instructor posts',
		});

		// Create a topic (main post) by admin
		topicObj = await topics.post({
			uid: adminUid,
			cid: categoryObj.cid,
			title: 'Test Topic Title',
			content: 'The content of test topic',
		});

		topicObj2 = await topics.post({
			uid: regularUserUid,
			cid: categoryObj.cid,
			title: 'Test Topic Title 2',
			content: 'The content of test topic 2',
		});
	});

	it('should return true if an instructor has replied to the topic', async () => {
		// Simulate an instructor replying to the topic
		await topics.reply({
			uid: instructorUid,
			tid: topicObj.topicData.tid,
			content: 'Reply from an instructor',
		});
		// console.log(`Instructor replied with post ID ${reply.pid}`);

        const hasInstructorPosts = await topics.hasInstructorPosts(topicObj.topicData.tid);
        console.log(`Has instructor posts: ${hasInstructorPosts}`);
        
        // Ensure the function returns true
        assert.strictEqual(hasInstructorPosts, true);
	});

	it('should return false if no instructor has replied to the topic', async () => {
		// Ensure there are no instructor replies in the topic
		const hasInstructorPosts = await topics.hasInstructorPosts(topicObj2.topicData.tid);
		assert.strictEqual(hasInstructorPosts, false);
	});

	it('should return false if a regular user has replied to the topic', async () => {
		// Simulate a regular user replying to the topic
		await topics.reply({
			uid: regularUserUid,
			tid: topicObj.topicData.tid,
			content: 'Reply from a regular user',
		});

		const hasInstructorPosts = await topics.hasInstructorPosts(topicObj2.topicData.tid);
		assert.strictEqual(hasInstructorPosts, false);
	});

	after(async () => {
		// Clean up if necessary
		await topics.delete(topicObj.topicData.tid);
		await topics.delete(topicObj2.topicData.tid);

		await user.delete(adminUid,instructorUid);
		await user.delete(adminUid,regularUserUid);
		await user.delete(adminUid,adminUid);
		
		
	});
});
