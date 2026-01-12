const express = require( "express" );
const morgan = require( 'morgan' );
const cors = require( 'cors' );
const app = express();


app.use( express.static( 'dist' ) );
app.use( cors() );
app.use( express.json() );

morgan.token( 'body', ( req ) => JSON.stringify( req.body ) );
app.use( morgan( ':method :url :status :response-time ms :body' ) );



let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get( '/info', ( request, response ) => {
  const count = persons.length;
  const now = new Date();
  response.send( `<p>Phonebook has info for ${ count } people.</p><p>${ now }</p>` );
} );

app.get( '/api/persons', ( request, response ) => {
  response.json( persons );
} );

app.get( '/api/persons/:id', ( request, response ) => {
  const id = request.params.id;
  const person = persons.find( person => person.id === id );

  if ( !person ) {
    return response.status( 404 ).json( { error: 'Sorry, cant find that' } );
  }

  response.send( person );

} );


app.delete( '/api/persons/:id', ( request, response ) => {
  const id = request.params.id;
  const person = persons.find( person => person.id === id );

  if ( !person ) {
    return response.status( 404 ).json( { error: 'Sorry, cant find that' } );
  }

  persons = persons.filter( person => person.id !== id );

  response.status( 204 ).end();
} );



const getRandomArbitrary = ( min, max ) => {
  return Math.floor( Math.random() * ( max - min + 1 ) + min );
};

app.post( '/api/persons', ( request, response ) => {
  const body = request.body;

  const id = getRandomArbitrary( 100, 200000 );

  if ( !body.name ) {
    return response.status( 400 ).json( {
      error: 'name missing'
    } );
  } else if ( !body.number ) {
    return response.status( 400 ).json( {
      error: 'number missing'
    } );
  }

  existingPerson = persons.find( person => person.name == body.name );

  if ( existingPerson ) {
    return response.status( 400 ).json( {
      error: 'name must be unique'
    } );
  }

  const newPerson = {
    id: id.toString(),
    name: body.name,
    number: body.number || '1234567890'
  };

  persons = persons.concat( newPerson );
  response.send( newPerson );

} );


const unknownEndpoint = ( request, response ) => {
  response.status( 404 ).send( { error: 'unknown endpoint' } );
};

app.use( unknownEndpoint );

const PORT = process.env.PORT || 3001;
app.listen( PORT, () => {
  console.log( `Server running on port ${ PORT }` );
} );
