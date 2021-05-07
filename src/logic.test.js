import Ship, { GameBoard } from "./logic";

test("should be an object", () => {
  let carrier = new Ship(5);
  expect(typeof carrier).toBe("object");
});

test("ship with the length of 5 should have a shipclass of carrier", () => {
  let carrier = new Ship(5);
  expect(carrier.shipClass).toBe("carrier");
});

test("value of position 2 on battleship shipclass should be hit", () => {
  let battleship = new Ship(4);
  battleship.hit(2);
  expect(battleship.getStructuralIntegrityAt(2)).toBe("hit");
});

test("isSunk should return false if there is a position on the ship that has not been hit", () => {
  let destoryer = new Ship(2);
  destoryer.hit(1);
  expect(destoryer.isSunk()).toBe(false);
});

test("isSunk should return true if all the positions on the ship have been hit", () => {
  let destoryer = new Ship(2);
  destoryer.hit(1);
  destoryer.hit(0);
  expect(destoryer.isSunk()).toBe(true);
});

test("should add ship object to fleet array", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "1A", dimension: "horizontal" });
  expect(board.fleet.length).toBe(1);
});

// horizontal

test("ship should be place horizontally(start) from 4A to 4D", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "4A", dimension: "horizontal" });
  expect(board.fleet[0].coordinates).toEqual([30, 31, 32, 33]);
});

test("ship should be place horizontally(middle) from 2D to 2F", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "2D", dimension: "horizontal" });
  expect(board.fleet[0].coordinates).toEqual([13, 14, 15, 16]);
});

test("ship should be place horizontally(end) from 10G to 10J", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "10G", dimension: "horizontal" });
  expect(board.fleet[0].coordinates).toEqual([96, 97, 98, 99]);
});

// Vertical

test("ship should be place vertically(start) from 1A to 4A", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "1A", dimension: "vertical" });
  expect(board.fleet[0].coordinates).toEqual([0, 10, 20, 30]);
});

test("ship should be place vertically(middle) from 5E to 8E", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "5E", dimension: "vertical" });
  expect(board.fleet[0].coordinates).toEqual([44, 54, 64, 74]);
});

test("ship should be place vertically(end) from 7J to 10J", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "7J", dimension: "vertical" });
  expect(board.fleet[0].coordinates).toEqual([69, 79, 89, 99]);
});

// invalids

test("Board should return error text if an invalid position is entered", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  expect(
    board.placeShip(battleship, { position: "1H", dimension: "horizontal" })
  ).toBe("pick different coordinates");
  expect(
    board.placeShip(battleship, { position: "5H", dimension: "horizontal" })
  ).toBe("pick different coordinates");
  expect(
    board.placeShip(battleship, { position: "10H", dimension: "horizontal" })
  ).toBe("pick different coordinates");
  expect(
    board.placeShip(battleship, { position: "8A", dimension: "vertical" })
  ).toBe("pick different coordinates");
  expect(
    board.placeShip(battleship, { position: "9B", dimension: "vertical" })
  ).toBe("pick different coordinates");
  expect(
    board.placeShip(battleship, { position: "10F", dimension: "vertical" })
  ).toBe("pick different coordinates");
});

// isShared

test("should return text if multiple ships share the same coordinates", () => {
  let battleship = new Ship(4);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "1A", dimension: "horizontal" });
  expect(
    board.placeShip(battleship, { position: "1B", dimension: "vertical" })
  ).toBe("you have shared coordinates");
});

// recieveAttack

test("gameboard should keep track of missed attacks", () => {
  let carrier = new Ship(5);
  let battleship = new Ship(4);
  let submarine = new Ship(3);
  // let destroyer = new Ship(2);
  // let destroyerTwo = new Ship(2);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "1A", dimension: "horizontal" });
  board.placeShip(carrier, { position: "5E", dimension: "horizontal" });
  board.placeShip(submarine, { position: "1F", dimension: "horizontal" });
  board.receiveAttack("1A");
  board.receiveAttack("1B");
  board.receiveAttack("2C");
  expect(board.misses).toEqual([12]);
});

test("gameboard should keep track of attacks that hit", () => {
  let carrier = new Ship(5);
  let battleship = new Ship(4);
  let submarine = new Ship(3);
  let board = new GameBoard();
  board.placeShip(battleship, { position: "1A", dimension: "horizontal" });
  board.placeShip(carrier, { position: "5E", dimension: "horizontal" });
  board.placeShip(submarine, { position: "1F", dimension: "horizontal" });
  board.receiveAttack("5A");
  board.receiveAttack("1F");
  board.receiveAttack("6H");
  expect(board.hits).toEqual([5]);
});

//  isFleetSunk

test("should return true if all ships in fleet are sunk", () => {
  let submarine = new Ship(3);
  let board = new GameBoard();
  board.placeShip(submarine, { position: "1A", dimension: "horizontal" });
  // board.placeShip(submarine, { position: "2A", dimension: "horizontal" });
  board.receiveAttack("1A");
  board.receiveAttack("1B");
  board.receiveAttack("1C");
  expect(board.isFleetSunk()).toBe(true);
});
