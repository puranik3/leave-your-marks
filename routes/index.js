const express = require( 'express' );
const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

const User = mongoose.model( 'User' );
const Story = mongoose.model( 'Story' );

const router = express.Router();

router.get( '/', function( req, res ) {
    res.render( 'index', {
        session: req.session
    });
});

router.get( '/login', function( req, res ) {
    res.render( 'login' );
});

router.post( '/authenticate', function( req, res ) {
    const { email, password } = req.body;
    console.log( 'email = ', email );
    console.log( 'password = ', password );

    User.findOne( { email: email }, function( err, user ) {
        console.log( 'User.find err = ', err );
        console.log( 'User.find user = ', user );

        if( err || !user ) {
            res.redirect( '/login' );    
            return;
        } else {
            bcrypt.compare( password, user.password, function( err, result ) {
                console.log( 'compare err = ', err );
                console.log( 'compare result = ', result );

                if( err || !result ) {
                    res.redirect( '/login' );
                    return;
                }

                req.session.user = user;
                res.redirect( '/stories/add' );
            });
        }
    });
});

router.get( '/logout', function ( req, res ) {
    req.session.destroy();
    res.redirect( '/login' );
});

router.get( '/registration', function( req, res ) {
    res.render( 'registration' );
});

router.post( '/register', function( req, res ) {
    const { username, email, password } = req.body;
    
    const user = new User({
        username,
        email,
        password
    });

    user.save(function( error, insertedUser ) {
        if( error ) {
            res.status( 401 ).json({
                message: error.message
            });
            return;
        }

        res.json( insertedUser );
    });
});

router.get( '/stories', function( req, res ) {
    Story.find( {}, function( error, stories ) {
        if( error ) {
            res.send( 'Some error occured while reading stories : ', error.message );
            return;
        }

        res.render( 'stories', {
            stories,
            session: req.session
        });
    });
});

// authenticated endpoint - only logged in users can view this page.
router.get( '/stories/add', function( req, res ) {
    if( req.session.user && req.session.user.username ) { // session data is present => user has previously logged in
        res.render( 'add-story', {
            session: req.session
        });
    } else {
        res.redirect( '/login' );
    }
});

router.post( '/add-story', function( req, res ) {
    if( req.session.user && req.session.user.username ) {
        if( !req.body.title ) {
            res.status( 400 ).send( 'title not present' );
            return;
        }

        const slug = req.body.title.toLowerCase().replace( /[^A-Za-z 0-9]/g, '' ).replace( /\s+/g, '-' );
        
        const story = new Story({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            summary: req.body.summary,
            body: req.body.body,
            slug: slug,
            author: req.session.user.username,
            comments: []
        });

        story.save(function( error, savedStory ) {
            if( error ) {
                res.send( 'Some error occured while saving your story : ', error.message );
                return;
            }

            res.redirect( '/stories' );
        });
    } else {
        res.redirect( '/login' );
    }
});

router.get( '/stories/:slug', function( req, res, next ) {
    Story.findOne( { slug: req.params.slug }, function( error, story ) {
        if( error ) {
            next( error );
            return;
        }

        if( !story ) {
            res.status( 404 ).send( 'No matching story found' );
            return;
        }

        res.render( 'story', {
            story,
            session: req.session
        });
    });
    
});

router.post( '/comment', function( req, res ) {
    const slug = req.body.slug;
    const comment = req.body.comment;

    if( req.session.user && req.session.user.username ) {
        Story.findOne( { slug }, function( error, story ) {
            if( error ) {
                res.send( 'Error saving comment' );
                return;
            }

            story.comments.push({
                body: comment,
                author: req.session.user.username
            });

            story.save(function( error, savedStory ) {
                if( error ) {
                    res.send( 'Error while saving comment : ' + error.message );
                    return;
                }

                res.redirect( 'stories/' + slug );
            });
        });
    } else {
        res.redirect( '/login' );
    }
});

module.exports = router;