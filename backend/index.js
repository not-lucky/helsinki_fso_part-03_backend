require( 'dotenv' ).config();
const express = require( "express" );
const morgan = require( 'morgan' );
const Person = require( "./models/person" );

const app = express();

const unknownEndpoint = ( request, response ) => {
  response.status( 404 ).send( { error: 'unknown endpoint' } );
};

const errorHandler = ( error, request, response, next ) => {
  console.error( error.message );

  if ( error.name === 'CastError' ) {
    return response.status( 400 ).send( { error: 'malformatted id' } );
  } else if ( error.name === 'ValidationError' ) {
    return response.status( 400 ).json( { error: error.message } );
  }

  next( error );
};

app.use( express.static( 'dist' ) );
app.use( express.json() );

morgan.token( 'body', ( req ) => JSON.stringify( req.body ) );
app.use( morgan( ':method :url :status :response-time ms :body' ) );

app.get( '/info', ( request, response ) => {
  const count = persons.length;
  const now = new Date();
  response.send( `<p>Phonebook has info for ${ count } people.</p><p>${ now }</p>` );
} );

app.get( '/api/persons', ( request, response ) => {
  Person.find( {} ).then( persons => {
    response.json( persons );
  } );

} );

app.get( '/api/persons/:id', ( request, response ) => {
  Person.findById( request.params.id )
    .then( person => {
      if ( !person ) {
        return response.status( 404 ).json( { error: 'Sorry, cant find that' } );
      }
      response.send( person );
    } )
    .catch( ( error ) => next( error ) );
} );


app.delete( '/api/persons/:id', ( request, response ) => {
  Person
    .findByIdAndDelete( request.params.id )
    .then( result => {
      response.status( 204 ).end();
    } )
    .catch( error => next( error ) );

} );


app.post( '/api/persons', ( request, response, next ) => {
  const body = request.body;

  const newPerson = Person( {
    // id: id.toString(),
    name: body.name,
    number: body.number || '1234567890'
  } );

  newPerson.save().then( savedPerson => {
    console.log( 'savedPerson', savedPerson );
    response.send( savedPerson );
  } )
    .catch( error => next( error ) );

} );



app.use( unknownEndpoint );
app.use( errorHandler );

const PORT = process.env.PORT || 3001;
app.listen( PORT, () => {
  console.log( `Server running on port ${ PORT }` );
} );
