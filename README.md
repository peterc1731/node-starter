# node-starter

Simple node API starter kit using MongoDB and JWT authorization, including a basic user model and example post model with CRUD methods.

## Features

### Authorization

The API contains several methods and a middleware that constitute a basic user auth system. The user object has three fields: 

```js
{
  name: {
    type: String,
    required: 'The username must not be empty',
    unique: true,
  },
  email: {
    type: String,
    required: 'The email must not be empty',
    unique: true,
  },
  password: {
    type: String,
    required: 'The password must not be empty',
  },
}
```

The following endpoints are available for users to interact with the API:

- `/register` - Register a user.
- `/login` - Login a user, returns a JWT to be used to access routes that require auth.
- `/me` **requires auth** - Returns the user object (but not the password!).
- `/logout` **requires auth** - Returns an object with an empty token field so the client can unset the locally stored token.
- `/unregister` **requires auth** - Removes the user from the database.

Routes that require authorization implement the `verifyToken` middleware, which verifies that a token was provided and is valid. The middleware also makes the token owner's username available via `req.locals.user`.

### Example model with CRUD endpoints

There is an example database model at `api/models/Post.js`, which has an associated controller at `api/controllers/PostController.js`. Five routes have been made available to interact with this model, covering many common database usage scenarios:

- `GET: /posts` - Get all posts in the DB.
- `POST: /posts` - Add a new post to the DB.
- `GET: /posts/:post_id` - Get a specific post by ID.
- `PUT: /posts/:post_id` - Update a specific post by ID.
- `DELETE: /posts/:post_id` - Delete a specific post by ID.

### Config

At the root of the project `config.js` contains all the environment specific variables, which can either be hardcoded for a local test environment or set as environment variables: 

- `mongodb.url` - MongoDB connection string.
- `token.secret` - Secret used to encrypt and verify JWTs, must be stored on the server and kept hidden. If this secret is changed, all currently distributed tokens will be invalidated.
- `token.lifetime` - Lifetime in seconds of any distributed JWT.
- `baseUrl` - Path at the beginning of all API routes e.g. http://yourdomain.com/{baseUrl}/register.
