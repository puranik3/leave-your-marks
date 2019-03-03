const express = require( 'express' );
const path = require( 'path' );
const session = require( 'express-session' );
require( './db' );

const indexRouter = require( './routes/index' );

const app = express();

app.set( 'view engine', 'ejs' );
app.set( 'views', path.join( __dirname, 'views' ) );

// SESSION_SECRET should be available as an environment variable
if( process.env.SESSION_SECRET ) {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));
} else {
    throw new Error( 'Session secret is not available in the environment' );
}
app.use( express.static( path.join( __dirname, 'public' ) ) );

// parses incoming form data and sets the data up as req.body on the req object
app.use( express.urlencoded( { extended: false } ) );

// parses incoming HTTP request body data in JSON format and sets the data up as req.body on the req object
app.use( express.json() );

app.use( '/', indexRouter );

app.use(function( req, res ) {
    res.render( '404' );
});

app.use(function( error, req, res, next ) {
    res.render( '500', {
        error
    });
});

const port = process.env.PORT || 3000;
app.listen( port, function( error ) {
    if( error ) {
        console.log( 'Server could not be started on port ' + port );
        console.error( error.message );
        return;
    }

    console.log( 'Check app on port ' + port );
});