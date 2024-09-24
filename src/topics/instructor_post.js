'use strict';


const db = require('../database');
const posts = require('../posts');
const groups = require('../groups');

const isInstructor = uid => groups.isMember(uid, 'instructor');


module.exports = function (Topics) {
	Topics.hasInstructorPosts = async function (tid) {
		// Get the list of posts for the specified topic ID (tid)
		const pids = await db.getSortedSetRange(`tid:${tid}:posts`, 0, -1);

		if (!pids.length) {
			return false; // No posts, so return false
		}

		// Retrieve the post data for the retrieved post IDs
		const postData = await posts.getPostsFields(pids, ['pid', 'uid']);

		// Check if any post is made by an instructor using the isInstructor function
		return postData.some(post => isInstructor(post.uid));
	};
};
