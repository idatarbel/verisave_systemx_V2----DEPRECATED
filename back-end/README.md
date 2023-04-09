This repository is forked from https://github.com/ag-grid/ag-grid-server-side-nodejs-example.
The original is a server side row management example using MySQL database as a datasource.
This fork is a modification that sources data from Postgres instead.

# ag-Grid Server-Side Node.js Example

A reference implementation showing how to perform server-side operations using ag-Grid with node.js and MySQL.

![](https://github.com/ag-grid/ag-grid/blob/latest/packages/ag-grid-docs/src/nodejs-server-side-operations/app-arch.png)

For full details see: http://ag-grid.com/nodejs-server-side-operations/

## Usage

- Clone the project
- run `yarn install`
- Create a Postgres database using the scripts in the data subdirectory.
- Rename example.env to .env and replace the variables in it with the connection information for your postgres database.
- start with `yarn start`
- open browser at `localhost:4000`
