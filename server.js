const express = require('express');
const cors = require('cors');
const postsRouter = require('./posts/postRouter');
const usersRouter = require('./users/userRouter');
const server = express();

server.use(cors());
server.use(express.json());
server.use(logger);

server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger (req, res, next) {
    console.log(`${req.method} to '${req.originalUrl}' from ${req.hostname} on ${new Date()}`);
    next();
}

module.exports = server;
