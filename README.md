<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://transparency.entsoe.eu/resources/v_2.13.0-3080/images/common/Header.png" width="640" alt="Entsoe Logo" /></a>
</p>

## GraphQL Adapter for Entsoe Transparency API
<p align="center">Since Entsoe only provides an XML interface, which is difficult to integrate into (web) applications, this repository contains a GraphQL adapter for the Entsoe API.</p>

## Entsoe API

The [Entsoe restful API Implementation Guide](https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html) explains the business context and provides the use case and process sequence.

### Installation with npm

```bash
$ npm install
```

### Installation with yarn

```bash
$ yarn
```

### Generate Typings
```bash
$ npm run prestart
```
After the generation you can find the typings in `./src/graphql.ts`.

### Running the app
To run the app you have to provide specific environment variables

|  Environment variable 	|                 Description                 	|
| ---------------------	|-------------------------------------------	|
| ENTSOE_API_URL        	| URL to the Entsoe Transparency API          	|
| ENTSOE_SECURITY_TOKEN 	| Security token for the Entsoe API           	|
| PLAYGROUND            	| GraphQL playground enabled `(true, false)` 	|
| DEBUG                 	| GraphQL debug enabled `(true, false)`      	|
| LOG_LEVEL             	| `debug, info, warn, error`               	|

#### Acess to Entsoe API
To use the adapter you have to provide a [<b>security token</b>](https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html#_authentication_and_authorisation).


#### Run the application
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Aigner Johannes](https://github.com/aignerjo)

