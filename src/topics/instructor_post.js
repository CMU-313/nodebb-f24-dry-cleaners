'use strict';


const db = require('../database');
const posts = require('../posts');
const groups = require('../groups');

const isInstructor = uid => groups.isMember(uid, 'instructor');


module.exports = function (Topics) {
	Topics.hasInstructorPosts = async function (tid) {
		// Get the list of poxsts for the specified topic ID (tid)
		const pids = await db.getSortedSetRange(`tid:${tid}:posts`, 0, -1);
		console.log(`Post IDs for topic ${tid}:`, pids);
		if (!pids.length) {
			return false; // No posts, so return false
		}

		// Retrieve the post data for the retrieved post IDs
		const postData = await posts.getPostsFields(pids, ['pid', 'uid']);
		console.log(`Post data for topic ${tid}:`, postData);

		// Check if any post is made by an instructor using the async isInstructor function
		const instructorCheckResults = await Promise.all(
			postData.map(post => isInstructor(post.uid))
		);

		console.log(`Instructor check results for topic ${tid}:`, instructorCheckResults);
		return instructorCheckResults.some(result => result === true);
	};
};
