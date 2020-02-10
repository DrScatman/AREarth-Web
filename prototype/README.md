# PROTOTYPE 1
This a prototype for the Extended Reality Gallery project for the Atomic Object Technology Showcase in the Library.
It is a build environment with only Threejs and Firebase.

#### NOTE
There is no Vuejs or Vuetify with the intention of focusing on core impelenations of Threejs and Firebase.
This way other group members don't need to learn Vuejs and Vuetify in order to understand general concepts of Threejs and Firebase first.
We will implementing this in Vuejs in a later sprint. This prototype allows us to work out kinks and plan our Vuejs implementation better.

## Requirements

Install the most recent versions of NPM and Yarn

## Installation

Clone or download this repository.
In the base directory of the prototype (has package.json) use the command:

```
yarn install
```

From there it should get all the dependencies required.

Verify it works by building the project:

```
yarn build
```

Then run a local server version with

```
yarn serve
```

From this you can go to the URL localhost:8080 (or whatever it tells you as the port number)
to see the project running in your browser

## Goal

To show proof of concept for:

### Threejs
- [ ] importing models:
    - [x] .glb
    - [ ] .obj
    - [ ] multiple files
    - [ ] drag and drop

- [ ] exporting models
    - [ ] .obj
    - [ ] .glb

- [x] viewing models
- [ ] applying effects
    - [x] scaling
    - [ ] rotation
    - [x] toggleable effects
    - [ ] normalize model size
- [x] loading cubemaps

### Firebase
- [x] setup connection to test db
- [ ] fetch data
- [ ] send or update data
- [ ] upload models
- [ ] download models

