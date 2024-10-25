const Iroh = require('iroh');

// let stage = new Iroh.Stage(`

// const winston = require('winston');

// // Mock Winston to avoid errors during testing
// winston.log = function() {};  // Replace the log function with a no-op
// winston.error = function() {};
// winston.info = function() {};

// const db = require('../mocks/databasemock');

// const topics = require('../../src/topics');


// const mockData = {
//   uid: 1,
//   cid: 1,
//   title: "Test Topic",
//   content: "This is a test post",
// };

// Topics.post(mockData).then((result) => {
//   console.log("Post created:", result);
// }).catch((err) => {
//   console.error("Error:", err);
// });
// `);

let stage = new Iroh.Stage(`
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
};
factorial(3);
`);

// Function call listener
stage.addListener(Iroh.CALL)
  .on("before", (e) => {
    console.log("Before call:", e.name, "with arguments:", e.arguments);
  })
  .on("after", (e) => {
    console.log("After call:", e.name, "returned:", e.return);
  });

// Function definition listener
stage.addListener(Iroh.FUNCTION)
  .on("enter", (e) => {
    console.log("Entering function:", e.name, "with arguments:", e.arguments);
  })
  .on("leave", (e) => {
    console.log("Leaving function:", e.name);
  });

// Program listener
stage.addListener(Iroh.PROGRAM)
  .on("enter", (e) => {
    console.log("Starting program execution");
  })
  .on("leave", (e) => {
    console.log("Program finished with result:", e.return);
  });


// Evaluate the script
eval(stage.script);

