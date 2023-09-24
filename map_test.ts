import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.104.0/testing/asserts.ts";
import { createMap } from "./map.ts";

Deno.test("cannot create an empty map", () => {
  assertThrows(
    () => {
      createMap("");
    },
    Error,
    "Invalid map",
  );
});

Deno.test("cannot create a map with invalid characters", () => {
  assertThrows(
    () => {
      // Lowercase letters are not allowed
      createMap("@---a---x");
    },
    Error,
    "Invalid map",
  );
});

Deno.test("can create a map from a jagged matrix", () => {
  const stringMap = `
              +-O-N-+
     |     |
     |   +-I-+
 @-G-O-+ | | |
     | | +-+ E
     +-+     S
             |
             x 
      `;
  const map = createMap(stringMap);
  // Upper-right corner
  assertEquals(map.getNode({x: 20, y: 1})?.character, '+')
  // Lower-right corner
  assertEquals(map.getNode({x: 13, y: 8})?.character, 'x')
});
