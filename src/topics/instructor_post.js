'use strict';

const posts = require('../posts'); // assuming this handles posts logic
const groups = require('../groups'); // assuming groups is the module handling roles

const isInstructor = uid => groups.isMember(uid, 'instructor');


module.exports = function (app) {
	// Use arrow function for the route handler
	app.get('/api/instructor-commented/:postId', async (req, res) => {
		try {
			const { postId } = req.params; // Destructure req.params to resolve the prefer-destructuring issue

			// Fetch all comments on the post
			const comments = await posts.getCommentsByPostId(postId);

			// Check if any of the commenters are instructors
			const hasInstructorComment = await Promise.any(
				comments.map(async ({ uid }) => isInstructor(uid)) // Destructure comment to get uid directly
			);

			res.json({ instructorCommented: hasInstructorComment });
		} catch (err) {
			res.status(500).json({ error: 'Unable to check instructor comments.' });
		}
	});
};
