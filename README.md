# Mongo III Mini Sprint

## Topics - OKAY √
 * [Mongoose's Populate Method](http://mongoosejs.com/docs/populate.html)
 * Model / Controller / Routes organization

## Running the Project - OKAY √
 * `cd` into your project directory
 * `npm install` to install dependencies
 * Run `mongod` to start your Mongo server from your root directory or create a `data` directory in this project and use `mongod --dbpath data`

## Mongoose's Populate Method
 For this mini sprint, there are two models we'll be utilizing: the Post model and the Comment model.
 The Comment model depends upon the Post model. You'll notice that the in the Post model schema we have this line
 ```
 comments: [{ type: mongoose.Schema.Types.Number, ref: 'Comment' }]
 ```
 This line specifies the `comments` field on the Post schema, which is an array populated by comment IDs.
 This is where the `populate()` method that Mongoose provides comes in. When we fetch a post, we want to
 also see all of its associated comments on the posts that we get back from the database. Without running
 `populate()`, our posts would come back with an array of just IDs of all of their comment children, without
 the comments' actual data. Here's an example of running the `populate()` command
 ```
 Post.findById(3).exec()
	.then((post) => {
		post.populate('comments');
		res.send(post);
	}
 ```

## Model / Controller / Routes Organization
 Take a look at how the files in this sprint are organized. The model directory holds the schemas. The routes
 directory specifies all of the routes of our little API. The controller directory holds all of the logic that
 needs to be executed upon querying individual endpoints.

 Think of this style of organization as analogous to the Model / View / Controller paradigm that is still commonly
 used in front end applications. It's just a way of organizing and modularizing different parts of what our project
 needs to do in a logical fashion. Organizing your code in this way makes it easier to find files in the future
 when a project scales and becomes much larger in terms of sheer number of lines of code. Also, a developer without
 any prior knowledge of the project can look around and orient themselves much more easily with an organization
 pattern such as this.

## Todos
 * Implement all of the different controller methods in the `controllers/postControllers.js` file.
 * Test your implementation locally on your Mongo server with either Postman, or via your terminal.
