# Autonomous JSON Database

Introduction

## Setup

Follow steps 1-6 of [this tutorial](https://www.oracle.com/database/technologies/appdev/quickstartnodejs.html#macos-tab) 
to setup the OracleDB environment.

### Troubleshooting Setup



## Functions (in progress)

[Full Documentation](https://oracle.github.io/node-oracledb/doc/api.html)

### Common Functions and Usage

| Function | Example Usage|
| --- | --- |
| *getConnection()* | ```let connection = await oracledb.getConnection({ user: <USERNAME>, password: <PASSWORD>, connectionString: <CONNECTION_STRING> });```|
| *getSodaDatabase()* | ```const soda = await connection.getSodaDatabase();``` |
| *openCollection()* | ```const collection = await soda.openCollection('myCollection');``` |
| *find()* | |
| *getDocuments()* | |
| *count()* | |
| *insertOneAndGet()* | ```const content = { name : "Bob" };```<br>```await collection.insertOne(content);```|
| *getContent()* | ```const parsed = doc.getContent();``` |
Connection string may look something like "db<numbers>_high".




Parses a SodaDocument object into a readable format.


connection.commit()
// this ensures that any data written by the connection is saved to the actual database.


