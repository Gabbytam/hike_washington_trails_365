
Include a readme file that explains how to use your app (also how to set up the db, obtain api keys, what environment variables are needed, etc, so anyone can fork and clone your app then run it locally


## How to set up:
1. fork and clone
2. install dependencies 
```
npm i 
```
3. create a `config.json` with the following code 
``` json
{
  "development": {
    "database": "<insert develop db name here >",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "<insert test db name here >",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "database": "<insert production db name here >",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```
**Note:** If your database requires a username and password, you'll need to include these fields as well.
4. create a database 
```
sequelize db:create <insert db name here > 
```
5. Migrate the `user` model to your database 
```
sequelize db:migrate 
```
6. Add a `SESSION_SECRET` (can be any string) and `PORT` environment variable in a `.env` file 

Lesson for data scraping: 
https://www.google.com/search?sxsrf=ALeKk01GwuzIcc6cGvB0laVDcXmYN4ltyQ%3A1605032404216&ei=1NmqX-_WDIO-0PEPlIuxuAw&q=data+scraping+javascript+tutorial&oq=data+scraping+javasc+tutorial&gs_lcp=CgZwc3ktYWIQAxgAMgQIIRAKOgQIABBHOgcIIxCwAhAnUJxJWJxRYIpaaABwAngAgAFUiAGcAZIBATKYAQCgAQGqAQdnd3Mtd2l6yAEIwAEB&sclient=psy-ab#kpvalbx=_4NmqX6PhMLuV0PEP3t-nmAM21