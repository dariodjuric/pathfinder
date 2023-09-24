import { createMap, Node } from "./map.ts";
import { assertEquals } from "https://deno.land/std@0.104.0/testing/asserts.ts";
import { collectLetters, move } from "./navigation.ts";

Deno.test("navigation will continue in last direction when arriving at intersection", () => {
  const stringMap = `
   +--+
   |  |   
@-----+
   |
   x 
      `;
  const map = createMap(stringMap);
  const previousNode = map.getNode({ x: 2, y: 3 });
  const currentNode = map.getNode({ x: 3, y: 3 }) as Node;
  const movement = move(previousNode, "right", currentNode, map);
  assertEquals(movement.toNode.character, "-");
  assertEquals(movement.toNode.coordinates.x, 4);
  assertEquals(movement.toNode.coordinates.y, 3);
});

Deno.test("navigation will continue in last direction when arriving at a letter intersection", () => {
  const stringMap = `
   +--+
   |  |   
@--D--+
   |
   x 
      `;
  const map = createMap(stringMap);
  const previousNode = map.getNode({ x: 2, y: 3 });
  const currentNode = map.getNode({ x: 3, y: 3 }) as Node;
  const movement = move(previousNode, "right", currentNode, map);
  assertEquals(movement.toNode.character, "-");
  assertEquals(movement.toNode.coordinates.x, 4);
  assertEquals(movement.toNode.coordinates.y, 3);
});

Deno.test("navigation will make a turn at a turn character", () => {
  const stringMap = `
@--+x
   ||
   ++ 
      `;
  const map = createMap(stringMap);
  const previousNode = map.getNode({ x: 2, y: 1 });
  const currentNode = map.getNode({ x: 3, y: 1 }) as Node;
  const movement = move(previousNode, "right", currentNode, map);
  assertEquals(movement.toNode.character, "|");
  assertEquals(movement.toNode.coordinates.x, 3);
  assertEquals(movement.toNode.coordinates.y, 2);
});

Deno.test("collection function will collect uncollected letters", () => {
  const collectedLetters = collectLetters([
    { coordinates: { x: 0, y: 0 }, character: "A" },
    { coordinates: { x: 1, y: 0 }, character: "B" },
    { coordinates: { x: 2, y: 0 }, character: "C" },
    { coordinates: { x: 3, y: 0 }, character: "D" },
    { coordinates: { x: 2, y: 0 }, character: "C" },
    { coordinates: { x: 1, y: 0 }, character: "B" },
    { coordinates: { x: 0, y: 0 }, character: "A" },
  ]);

  assertEquals(collectedLetters, "ABCD");
});
