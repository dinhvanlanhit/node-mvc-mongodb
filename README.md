# Nodejs Expressjs MongoDB Ready-to-use API Project 


```bash
cd myproject
npm install
```


### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## Project structure basic
```sh
├── app.js
├── package.json
├── app
│   ├──console
│   │   └── index.js
│   ├──http
│   │    ├──controllers
│   │    │    ├── api
│   │    │    │    ├── auth.controller.js
│   │    │    └── app
│   │    ├──middleware
│   │    │    ├── authorization.js
│   │    │    ├── error-handler.js
│   │    ├──validators
│   │    │    ├── author
│   │    │    ├── users
│   ├── models
│   │   └── user.model.js
│   ├── utils
│   │   ├── APIError
│   │   └── common.js
├── bin
│   └── www
├── config
│   ├── config.js
│   ├── i18n.js
│   ├── passport.js
│   └── transporter.js
├── database
│   └── mongoose.js
├── public
│   └── style.css
├── resources
│   ├── lang
│   └── views  
├── routes
│   ├── api
│   │   ├── auth.js
│   │   └── index.js
│   └── app 
```
## How to run
### Running API server locally
```bash
npm run dev
```
##License
This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
 
