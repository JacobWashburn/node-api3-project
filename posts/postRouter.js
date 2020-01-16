const express = require ('express');
const db = require ('./postDb');

const router = express.Router ();

router.get ('/', (req, res) => {
    db.get ()
        .then (posts => {
            res.status (200).json (posts);
        })
        .catch (error => {
            console.log ('get all posts error', error);
            res.status (500).json ({message: 'Not able to get any posts.'});
        });
});

router.get ('/:id',validatePostId, (req, res) => {
    const postId = req.params.id;
    db.getById(postId)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(error => {
            console.log ('get post by id error', error);
            res.status(500).json({message: `Could not get a user with the Id: ${postId}`})
        })
});

router.delete ('/:id', (req, res) => {
    // do your magic!
});

router.put ('/:id', (req, res) => {
    // do your magic!
});

// custom middleware

function validatePostId (req, res, next) {
    if (req.params.id) {
        next ();
    } else {
        res.status (500).json ({message: 'You did not provide a post Id.'});
    }
}

module.exports = router;
