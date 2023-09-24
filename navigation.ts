import {
  Direction,
  END_CHARACTER,
  Map,
  Node,
  START_CHARACTER,
  TURN_CHARACTER,
  VALID_LETTERS_REGEX,
} from "./map.ts";

interface Movement {
  toNode: Node;
  direction: Direction;
}

function getValidDirections(
  currentNode: Node,
  previousDirection: Direction | null,
): Direction[] {
  if (currentNode.character === TURN_CHARACTER) {
    if ((previousDirection === "up" || previousDirection == "down")) {
      return ["left", "right"];
    }
    if ((previousDirection === "left" || previousDirection == "right")) {
      return ["up", "down"];
    }
  }

  const validDirections = [] as Direction[];
  const allDirections: Direction[] = ["up", "right", "down", "left"];
  if (previousDirection !== null) {
    // Last direction takes priority over other directions
    validDirections.push(previousDirection);
  }

  validDirections.push(
    ...allDirections.filter((direction) =>
      previousDirection === null || direction !== previousDirection
    ),
  );

  return validDirections;
}

export function move(
  previousNode: Node | null,
  previousDirection: Direction | null,
  currentNode: Node,
  map: Map,
): Movement {
  const possibleMoves: Movement[] = [];
  for (const direction of getValidDirections(currentNode, previousDirection)) {
    const nextNode = map.getNodeInDirection(currentNode.coordinates, direction);

    if (nextNode !== null && nextNode?.character !== null) {
      if (
        nextNode.coordinates.x === previousNode?.coordinates.x &&
        nextNode.coordinates.y === previousNode?.coordinates.y
      ) {
        // Do not go back
        continue;
      }

      possibleMoves.push({
        toNode: nextNode,
        direction,
      });
    }
  }

  if (possibleMoves.length === 0) {
    if (currentNode.character === TURN_CHARACTER) {
      throw Error("Fake turn");
    } else {
      throw Error("Broken path");
    }
  }

  if (possibleMoves.length > 1) {
    if (currentNode.character === TURN_CHARACTER) {
      throw Error("Fork in path");
    }

    if (currentNode.character === START_CHARACTER) {
      throw Error("Multiple starting paths");
    }
  }

  return possibleMoves[0];
}

export function navigate(map: Map) {
  const result = {
    pathAsCharacters: "",
    letters: "",
  };
  const startNode = map.findRawCharacter(START_CHARACTER);
  if (startNode === null) {
    return result;
  }

  const traversedNodes: Node[] = [startNode];

  let previousNode: Node | null = null;
  let currentNode = traversedNodes[0];
  let previousDirection: Direction | null = null;
  while (currentNode.character !== END_CHARACTER) {
    const movement = move(previousNode, previousDirection, currentNode, map);
    traversedNodes.push(movement.toNode);
    previousNode = currentNode;
    currentNode = movement.toNode;
    previousDirection = movement.direction;
  }

  result.pathAsCharacters = traversedNodes.map((node) => node.character).join(
    "",
  );
  result.letters = collectLetters(traversedNodes);

  return result;
}

export function collectLetters(traversedNodes: Node[]) {
  // Use a set to keep track of which letters' coordinates were already collected
  const seen = new Set<string>();

  return traversedNodes.filter((node) => {
    if (node.character === null || !VALID_LETTERS_REGEX.test(node.character)) {
      return false;
    }

    const key = `${node.coordinates.x},${node.coordinates.y}`;
    if (seen.has(key)) {
      return false;
    } else {
      seen.add(key);
      return true;
    }
  }).map((node) => node.character).join("");
}
