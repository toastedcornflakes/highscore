An http highscore server
========================

[![Build Status](https://travis-ci.org/grasGendarme/highscore.png?branch=master)](https://travis-ci.org/grasGendarme/highscore)

Example request to get the best score of player bob who is playing pokemon

    GET /pokemon/bob/best

Get the latest score achieved by bob:

    GET /pokemon/player/bob/latest

Get the best score ever for pokemon

    GET /pokemon/worldwide

Set a new score (of 1337 points) of bob playing pokemon

    PUT /pokemon/bob/1337

Installing
---------
Install [redis](http://redis.io/) and start it with `redis-server`

    npm install
    npm start

To run the tests
    
    npm test

TODO
----
- [ ] Cover writing in tests