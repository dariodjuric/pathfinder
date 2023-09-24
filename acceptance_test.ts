import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.104.0/testing/asserts.ts";
import { navigate } from "./navigation.ts";
import { createMap } from "./map.ts";

async function pathToMap(path: string) {
  const stringMap = await Deno.readTextFile(path);
  return createMap(stringMap);
}

Deno.test("a basic example", async () => {
  const map = await pathToMap("test_maps/valid/basic_example.txt");
  const navigationResult = navigate(map);
  assertEquals(navigationResult.pathAsCharacters, "@---A---+|C|+---+|+-B-x");
  assertEquals(navigationResult.letters, "ACB");
});

Deno.test("go straight through intersections", async () => {
  const map = await pathToMap(
    "test_maps/valid/go_straight_through_intersections.txt",
  );
  const navigationResult = navigate(map);
  assertEquals(
    navigationResult.pathAsCharacters,
    "@|A+---B--+|+--C-+|-||+---D--+|x",
  );
  assertEquals(navigationResult.letters, "ABCD");
});

Deno.test("letters may be found on turns", async () => {
  const map = await pathToMap(
    "test_maps/valid/letters_may_be_found_on_turns.txt",
  );
  const navigationResult = navigate(map);
  assertEquals(navigationResult.pathAsCharacters, "@---A---+|||C---+|+-B-x");
  assertEquals(navigationResult.letters, "ACB");
});

Deno.test("do not collect a letter from the same location twice", async () => {
  const map = await pathToMap(
    "test_maps/valid/do_not_collect_a_letter_from_the_same_location_twice.txt",
  );
  const navigationResult = navigate(map);
  assertEquals(
    navigationResult.pathAsCharacters,
    "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x",
  );
  assertEquals(navigationResult.letters, "GOONIES");
});

Deno.test("keep direction, even in a compact space", async () => {
  const map = await pathToMap(
    "test_maps/valid/keep_direction_even_in_a_compact_space.txt",
  );
  const navigationResult = navigate(map);
  assertEquals(navigationResult.pathAsCharacters, "@B+++B|+-L-+A+++A-+Hx");
  assertEquals(navigationResult.letters, "BLAH");
});

Deno.test("ignore stuff after end of path", async () => {
  const map = await pathToMap(
    "test_maps/valid/ignore_stuff_after_end_of_path.txt",
  );
  const navigationResult = navigate(map);
  assertEquals(navigationResult.pathAsCharacters, "@-A--+|+-B--x");
  assertEquals(navigationResult.letters, "AB");
});

Deno.test("missing start character", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap(
        "test_maps/invalid/missing_start_character.txt",
      );
      navigate(map);
    },
    Error,
    "Start character not found",
  );
});

Deno.test("missing end character", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap(
        "test_maps/invalid/missing_end_character.txt",
      );
      navigate(map);
    },
    Error,
    "End character not found",
  );
});

Deno.test("multiple starts 1", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap("test_maps/invalid/multiple_starts_1.txt");
      navigate(map);
    },
    Error,
    "Multiple start characters",
  );
});

Deno.test("multiple starts 2", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap("test_maps/invalid/multiple_starts_2.txt");
      navigate(map);
    },
    Error,
    "Multiple start characters",
  );
});

Deno.test("multiple starts 3", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap("test_maps/invalid/multiple_starts_3.txt");
      navigate(map);
    },
    Error,
    "Multiple start characters",
  );
});

Deno.test("fork in path", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap("test_maps/invalid/fork_in_path.txt");
      navigate(map);
    },
    Error,
    "Fork in path",
  );
});

Deno.test("broken path", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap("test_maps/invalid/broken_path.txt");
      navigate(map);
    },
    Error,
    "Broken path",
  );
});

Deno.test("multiple starting paths", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap(
        "test_maps/invalid/multiple_starting_paths.txt",
      );
      navigate(map);
    },
    Error,
    "Multiple starting paths",
  );
});

Deno.test("fake turn", async () => {
  await assertRejects(
    async () => {
      const map = await pathToMap("test_maps/invalid/fake_turn.txt");
      navigate(map);
    },
    Error,
    "Fake turn",
  );
});
