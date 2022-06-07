#





# MVC

# routes serving as Controller

# views

# models

# router
export the router

# public folder to render static file

# layout folder
carries the layout for all pages
a template to be render along with any body from the view specified in the route

# install dotenv
create .env file manually

added the database_url in the .env file

# add if statement in server.js to load if we are not in 'production'

# create .gitignore
added .env and node_module folder
turns grey
and ignored on git commands (add, commit and push)

# then push to a manually created repo on git

# deploy on HEROKU but i deployed on Netlify-app

# create partials folder
for files not related to root
then include in layout (e.g. header)

# create _form_field.ejs
since its importing a partial and not an actual file
use this partial in the actual form of new Author

# magic
{ author: new Author() }
get body.name in form input
and pass it into the author Schema of Db through the route

# in routes post request
create a author var to connect to model
grab the text as req.body,name then input into db by author.save
if not text as required, error handling sends a errorMessage and populate the body back to client


# error message
created errorMessage.ejs in partials
grab any errorMessage text on the route by <%= %>
and imported the message in layouts by <%- %>

# Async Await
since mongoose uses async we want to use async too for CRUD/REST
so we use try for success and catch for error

# adjusted the errorMessage with if statement <% %>

# added the loop statement to get all authors and display on the index page
- created a searchOption to grab the client search as to req.query.name 
- uses regular expression to allow part or complete search of the text and uses case insensitive
- and check the loop for it 

# add the searchOption.name into the input.value of the form in the index.ejs
so on this page we have the name and the searchOption