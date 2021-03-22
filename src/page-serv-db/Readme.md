# Page-service Database

This is a container running mongodb. It populates using the data in captures.json.

To run:

```shell
cd ..
docker-compose up pageserv-db
```

To run with port 27017 available in localhost:

```shell
cd ..
source aliases.sh
docker-compose-dev up pageserv-db
```
