KIBANA-TIMELION-LIGA
---
This repo will install kibana, timelion, elasticsearch, in addition it will index some data and create some demo dashboards

# Requisites
it is needed to have installed docker and docker compose (optional).

**Installation**

```shell
$ git clone repo
$ cd repo
$ docker-compose up
```
This will start a elasticsearch container, kibana container and an indexer that it will reindex the data from the csv files.

Then kibana will run in the ***port 5601***.
Also it will run the [timelion plugin](https://github.com/elastic/timelion) here you can get some more [info](https://www.elastic.co/blog/timelion-timeline)

# Data structure

The indexer will create two indexes

|INDEX|TYPE|MAPPING|
|-----|-----|-----|
|liga|partidos|[esMatchMapping.json]('./lib/esMatchMapping.json')|
|liga2|platillas|[esPlantillasMapping.json]('./lib/esPlantillasMapping.json')|
