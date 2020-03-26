# FastAPI Chat

An example chat application using FastAPI, React, and WebSockets.
It uses no persistence so all of the chat information is stored in
memory.  However postgres is configured as a docker container so should
be easy to add persistence.

## Features
- **FastAPI** with Python 3.8
- **React 16** with Typescript, Redux, and react-router

## Development

The only dependencies for this project should be docker and docker-compose.

### Quick Start
Starting the project with hot-reloading enabled 
(the first time it will take a while):
```
docker-compose up -d
```
- Backend will be at http://localhost:8888
- Auto-generated docs at 
http://localhost:8888/docs
- Frontend at http://localhost:8000


### Frontend Development
Alternatively to running inside docker, it can sometimes be easier 
to use npm directly for quicker reloading.  To run using npm:
```
cd frontend
npm install
npm start
```
This should redirect you to http://localhost:3000

## Testing
```
docker-compose run backend pytest
```

## Logging
```
docker-compose logs
```

Or for a specific service:
```
docker-compose logs -f name_of_service # frontend|backend|db
```