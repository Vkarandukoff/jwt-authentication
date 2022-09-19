Made requests with Postman

Create REST API server with bearer token auth. Setup CORS to allow access from any domain. DB - any.
Token should have expiration time 10 mins and extend it on any user request (except singin/logout)
DB - MongoDB
API (JSON):

http://localhost:3000/auth/signup [POST] - creation of new user
⁃ Fields id and password. Id - phone number or email. After signup add field `id_type` - phone or email
⁃In case of successful signup - return token 

http://localhost:3000/auth/signin [POST] - request for bearer token by id and password 

http://localhost:3000/auth/logout [GET] - with param `all`: 
⁃true - removes all users bearer tokens
⁃false - removes only current token

http://localhost:3000/auth/info [GET] - returns user id and id type

http://localhost:3000/auth/latency [GET] - returns service server latency for google.com 
