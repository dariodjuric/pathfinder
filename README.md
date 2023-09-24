# Pathfinder

Follows a path of characters & collects letters:

- Starts at the character @
- Follows the path
- Collects letters
- Stops when the x character is reached

## Local setup

This project requires
[Deno](https://docs.deno.com/runtime/manual/getting_started/installation). After
installing it, you can run the tests using:

```shell
deno test --allow-read
```

## Project structure

The project consists of the following:

- `map` module and the accompanying unit tests. This module contains functions
  related to loading the map and reading map nodes.
- `navigation` module and the accompanying unit tests. This module contains
  functions related to navigating the map.
- `acceptance_test.ts` contains acceptance tests for the project.
- `test_maps` contains test maps for the acceptance tests.
- `.github` directory contains a GitHub workflow that runs tests on every push.
