KIBANA-LIGA
---
This a project to show that kibana can be use to analyze more than logs ;)
It will be use to analyze Spanish Liga data.

# Requisites
it is need it to have installed docker and docker compose (optional).

**Installation**

```shell
$ git clone repo
$ cd repo
$ docker-compose up
```
This will start a elasticsearch container, kibana container and an indexer that it will reindex the data from the csv files.



# Data structure

The indexer will create two indexes

|INDEX|TYPE|MAPPING|
|-----|-----|-----|
|liga|partidos|[esMatchMapping.json]('./lib/esMatchMapping.json')|
|liga|platillas|[esPlantillasMapping.json]('./lib/esPlantillasMapping.json')|

### match type
Example

```json
{

}
```

### team

Example

```json
{

}
```
