export const START_CHARACTER = "@";
export const END_CHARACTER = "x";
export const TURN_CHARACTER = "+";
export const VALID_LETTERS_REGEX = /^[A-Z]+$/;
export const VALID_MAP_CHARACTERS = /^[A-Z@x\-|+\t\s]+$/;

export interface Node {
  coordinates: Coordinates;
  character: string | null;
}

export interface Coordinates {
  x: number;
  y: number;
}

export type Direction = "up" | "down" | "left" | "right";

export interface Map {
  findRawCharacter(character: string): Node | null;

  getNode(coordinates: Coordinates): Node | null;

  getNodeInDirection(
    source: Coordinates,
    direction: Direction,
  ): Node | null;
}

export function createMap(stringMap: string): Map {
  validateStringMap(stringMap);

  const rows = stringMap.split("\n");
  // Store the characters in a two-dimensional array, where empty space are nulls
  const matrix: (string | null)[][] = rows.map((row) =>
    Array.from(row).map(replaceWithNull)
  );
  return {
    findRawCharacter(character: string): Node | null {
      for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
        for (
          let columnIndex = 0;
          columnIndex < matrix[rowIndex].length;
          columnIndex++
        ) {
          if (matrix[rowIndex][columnIndex] === character) {
            return {
              character,
              coordinates: {
                y: rowIndex,
                x: columnIndex,
              },
            };
          }
        }
      }
      return null;
    },
    getNode(coordinates: Coordinates) {
      if (coordinates.y < 0 || coordinates.y > matrix.length - 1) {
        return null;
      }

      const row = matrix[coordinates.y];

      if (coordinates.x < 0 || coordinates.x > row.length - 1) {
        return null;
      }

      return {
        character: matrix[coordinates.y][coordinates.x],
        coordinates: {
          x: coordinates.x,
          y: coordinates.y,
        },
      };
    },
    getNodeInDirection(
      source: Coordinates,
      direction: Direction,
    ): Node | null {
      let xOffset = 0;
      let yOffset = 0;
      switch (direction) {
        case "up":
          yOffset = -1;
          break;
        case "down":
          yOffset = 1;
          break;
        case "left":
          xOffset = -1;
          break;
        case "right":
          xOffset = 1;
          break;
      }

      const newY = source.y + yOffset;
      const newX = source.x + xOffset;

      return this.getNode({ x: newX, y: newY });
    },
  };
}

function validateStringMap(stringMap: string) {
  if (!VALID_MAP_CHARACTERS.test(stringMap)) {
    throw Error(
      "Invalid map",
    );
  }

  const startOccurrences = countOccurrences(stringMap, START_CHARACTER);

  if (startOccurrences === 0) {
    throw Error("Start character not found");
  }

  if (startOccurrences > 1) {
    throw Error("Multiple start characters");
  }

  const endOccurrences = countOccurrences(stringMap, END_CHARACTER);

  if (endOccurrences === 0) {
    throw Error("End character not found");
  }
}

function countOccurrences(str: string, char: string) {
  return str.split(char).length - 1;
}

function replaceWithNull(value: string | null): null | string {
  if (value === "\t" || value === " " || value === "") {
    return null;
  }
  return value;
}
