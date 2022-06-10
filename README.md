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
### Git push

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

### Git push

# created book route and model
we store image file on the files folder in the server and not in the database
we store a string name in the Db to connect to the file folders on the server to fetch the image

# views and route for books
populate data from author table into row related table
use this data on the forms in book view as select field

### data population 1
var are set and made available after the res, req
this var are used on the view page as objects
for loops are done on the Model/Db in the route/controller then the result is used in the view
e.g. Author.find({})

### data population 2
client side also have data and are made available after as objects in req.body req.params
this data from views can be used in the route/controller

# JSON Object <%= object == null ? '' : 'a'%>
if the object is null return empty string else return a

# ISOSTRING() converts date field to string with date and time
2022-06-08T20:21
ISOSTRING().split('T') removes all that comes after the T which is the time
ISOSTRING().split('T')[0] prints only the date part of this output

# a little read-up (stack overflow)
<%= "Hello world" %> 
Basically, what <%= %> does is to call the toString() method of the expression that is being evaluated.

### images
we want to keep it in the server (public folder)
keep only the path URL of that file (in the public) in the Db as a string
no image will be kept in the Db, just the path URL

from model, export the path to route as a var, join public folder and var with path.join()
set it as dest in multer, set imageMimeTypes and use in the fileFilter({ }) when callback when ) is null

the multer allows the file to be accessible as req.file


# multipart and path
enctype="multipart/form-data" included on the form
path.join to combine paths 'path', Book.coverImageBasePath
public folder and a row in the Book model

# const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
set the supported file types on the upload in the router
use in the post router, allow single upload and name it 'cover'
upload.single('cover')

# ternary operator
req.file != null ? req.file.filename : null
if req.file is not null give req.file.filename else give null
e.g. if laptop = Mac ? 'Mac' : 'HP'

# using fs
file system library builtin by Node to manage files on the server
use it to delete bookCover saved while there is an error creating the book

# displaying images on the Book index view
- created a virtual entity in the book Model and connecting the path as:
return path.join('/', coverImageBasePath, this.coverImageName)
- make it available as a src="" on the img in books/index (view)

# const books = await Book.find({})
gets the all covers available since there is no filter
# const books = await Book.find(searchOptions)
is a filtered loop and fetch command

# using value on input in form
- this allows the data to be populated to the client when there is an error
- use the var/local names created in the route/req.params var (in this case 'searchOptions')

# query.lte l t e <=
query is less than and equal to
- query.lte('publishDate', req.query.publishBefore)
if publishDate is less than or equal to req.query.publishBefore
# query.gte g t e >=
- query.gte('publishDate', req.query.publishAfter)
if publishDate is greater than or equal to req.query.publishAfter

# re assigning const is not allowed, use let for re assign
- incorrect
const query
const books = await query.exec()
- correct
let query
const books = await query.exec()

# sorting
books = Book.find().sort({ createdAt : 'desc'}).limit(10)
a loop in book model and sorted in descending order
then returns only the first 10

# gitignore the public/uploads 
we are not only using it for development
this folder with be generated on the hosting side (e.g. heroku) during production

### git push

### file pond to upload images to our database
file preview
file resize
file encode

# no more use of multipart form 
since we are using filepond to encode, there is no more use of enctype="multipart/form-data" class in view
no more upload.single('cover') in route POST request
filePond will send JSON Objects as data
'data' is in 64-bits

# update the model 
edit coverImageName to coverImage {type: Buffer}
added coverImageType for {png,gif,jpeg}
update the virtual object for views to use
removed const coverImageBasePath and require ('path') 

# updating Controller
function removeBookCover(fileName){} removed since we are not dealing with files
removed fs and path global var

# create a saveCover function for JSON object from filepond
parsed the JSON object from view
checked the image type then grab the cover as data
covert to buffer as buffer.from() specifying the bit = 'base64'
then save to book.coverImage row in book model
also grab the type of image and save to model

# removed in POST request of controller
const uploadPath
const fileName = req.file != null ? req.file.filename : null
coverImageName: fileName,

# issues with Buffer object in Db from conversion in route
this cannot be displayed to client
so we use virtualObject() in model to grab coverImage and coverImageType
then convert the Buffer back to string which is base64
we then use it to reference the image and display in HTMl data object using backticks ``

# update .gitignore
you can delete the public/uploads and remove it in the .gitignore too