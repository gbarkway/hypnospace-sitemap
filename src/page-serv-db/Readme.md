# Page-service Database

This is a container running mongodb. It populates using the data in captures.json.

To run:

```
cd ..
docker-compose up pageserv-db
```

To run with port 27017 available in localhost:
```
cd ..
source aliases.sh
docker-compose-dev up pageserv-db
```

Note: if your Git is set up to replace Unix-style line endings with Windows ones automatically, the container may be unable to read the startup script properly and seeding will fail.