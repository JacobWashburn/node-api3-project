const express = require ('express');
const users = require ('./userDb');
const posts = require('../posts/postDb');
const router = express.Router ();

router.post ('/', validateUserPost, (req, res) => {
    const newPost = req.body;
    users.insert (newPost)
        .then (post => {
            res.status (201).json ({createdUser: post});
        })
        .catch (error => {
            console.log ('adding a post error', error);
            res.status (500).json ({message: 'Was not able to add that post.'});
        });
});

router.post ('/:id/posts', (req, res) => {
    const newPost = {text: req.body.text, user_id: req.params.id};
    console.log ('new post', newPost);
    if (newPost.text && newPost.user_id) {
    	posts.insert(newPost)
            .then(post => {
                res.status(201).json({createdPost: post})
            })
            .catch(error => {
                console.log ('add post for user error', error);
                res.status(500).json({message: 'Could not add a new post.'})
            })
    } else {
        res.status(500).json({message: 'wrong format'})
    }
});

router.get ('/', (req, res) => {
    users.get ()
        .then (users => {
            res.status (200).json (users);
        })
        .catch (error => {

        });
});

router.get ('/:id', validateUserId, (req, res) => {
    const userId = req.user;
    users.getById (userId)
        .then (user => {
            res.status (200).json (user);
        })
});

router.get ('/:id/posts', validateUserId, (req, res) => {
    const userId = req.params.id;
    users.getUserPosts (userId)
        .then (posts => {
            res.status (200).json (posts);
        })
        .catch (error => {
            console.log ('get all of users posts by user id error', error);
            res.status (500).json ({message: 'Could not get any posts using that id.'});
        });
});

router.delete ('/:id', validateUserId, (req, res) => {
    const userId = req.params.id;
    users.remove (userId)
        .then (count => {
            if (count) {
                res.status (200).json ({message: `User with the Id: ${userId} has been removed.`});
            } else {
                res.status (500).json ({message: 'No user with that id.'});
            }
        })
        .catch (error => {
            console.log ('remove user based on user id', error);
            res.status (500).json ({message: 'There was an error when trying to remove using that id.'});
        });
});

router.put ('/:id', validateUser, (req, res) => {
    const userId = req.params.id;
    const changedFields = req.body;
    users.update (userId, changedFields)
        .then (count => {
            res.status (201).json ({message: `${count} users were updated.`});
        })
        .catch (error => {
            res.status (500).json ({message: 'There was a problem updating that user.'});
        });
});

//custom middleware

function validateUserId (req, res, next) {
    if (typeof Number (req.params.id) === 'number') {
        users.getById (req.params.id)
            .then (user => {
                if (user) {
                    req.user = req.params.id;
                    next ();
                } else {
                    res.send ('No user found with that id.');
                }
            });


    } else {
        res.status (500).json ({message: 'You did not provide a valid user Id.'});
    }
}

function validateUser (req, res, next) {
    if ( !req.body.name) {
        res.status (404).json ({message: 'Please provide a user name.'});
    } else if (req.body.id !== Number (req.params.id)) {
        res.status (404).json ({message: 'Please make sure that the user id and url id are the same'});
    } else {
        next ();
    }
}

function validateUserPost (req, res, next) {
    const user = req.body;
    if (user.name && typeof user.name === 'string') {
        next ();
    } else if (!user.name) {
        res.status (500).json ({message: 'You must provide a name.'});
    } else {
        res.status (500).json ({message: 'You must provide a valid users name.'});
    }
}

module.exports = router;
