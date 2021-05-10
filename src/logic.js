export default class Ship {
  constructor(length) {
    const getShipClass = (l) => {
      let ship;
      switch (l) {
        case 5:
          ship = "carrier";
          break;
        case 4:
          ship = "battleship";
          break;
        case 3:
          ship = "submarine";
          break;

        default:
          ship = "destroyer";
          break;
      }
      return ship;
    };

    this.length = length;
    this.shipStructure = new Array(length).fill(null);
    this.shipClass = getShipClass(this.length);
  }
  hit(position) {
    if (position >= 0 && position <= this.length - 1) {
      this.shipStructure[position] = "hit";
      return true;
    } else {
      return false;
    }
  }
  getStructuralIntegrityAt(position) {
    return this.shipStructure[position];
  }
  isSunk() {
    return this.shipStructure.every((val) => val === "hit");
  }
}
let carrier = new Ship(5);
let battleship = new Ship(4);
let submarine = new Ship(3);
let destroyerOne = new Ship(2);
let destroyerTwo = new Ship(2);
const shipsArray = [carrier, battleship, submarine, destroyerOne, destroyerTwo];
//  A Good Idea would be to keep my battleships in an array. And not create them on the spot.
class GameBoard {
  constructor() {
    this.board = [
      "1A",
      "1B",
      "1C",
      "1D",
      "1E",
      "1F",
      "1G",
      "1H",
      "1I",
      "1J",
      "2A",
      "2B",
      "2C",
      "2D",
      "2E",
      "2F",
      "2G",
      "2H",
      "2I",
      "2J",
      "3A",
      "3B",
      "3C",
      "3D",
      "3E",
      "3F",
      "3G",
      "3H",
      "3I",
      "3J",
      "4A",
      "4B",
      "4C",
      "4D",
      "4E",
      "4F",
      "4G",
      "4H",
      "4I",
      "4J",
      "5A",
      "5B",
      "5C",
      "5D",
      "5E",
      "5F",
      "5G",
      "5H",
      "5I",
      "5J",
      "6A",
      "6B",
      "6C",
      "6D",
      "6E",
      "6F",
      "6G",
      "6H",
      "6I",
      "6J",
      "7A",
      "7B",
      "7C",
      "7D",
      "7E",
      "7F",
      "7G",
      "7H",
      "7I",
      "7J",
      "8A",
      "8B",
      "8C",
      "8D",
      "8E",
      "8F",
      "8G",
      "8H",
      "8I",
      "8J",
      "9A",
      "9B",
      "9C",
      "9D",
      "9E",
      "9F",
      "9G",
      "9H",
      "9I",
      "9J",
      "10A",
      "10B",
      "10C",
      "10D",
      "10E",
      "10F",
      "10G",
      "10H",
      "10I",
      "10J",
    ];
    this.fleet = [];
    this.hits = [];
    this.misses = [];
  }
  placeShip(ship, coordinates) {
    // I add ship to battleshipesArray after it is successfully placed, else throw error.
    // check whether position has already been taken
    let start = this.board.indexOf(coordinates.position);
    let coordinatesArray = [];
    let current = start;
    // the rest of the coordinates are going to be determined by wether the ship goes horizontal or vertical
    if (coordinates.dimension === "vertical") {
      let cap = 99;

      if (current + (ship.length - 1) * 10 > cap) {
        return "pick different coordinates";
      }

      while (coordinatesArray.length !== ship.length) {
        coordinatesArray.push(current);
        current += 10;
      }
    } else if (coordinates.dimension === "horizontal") {
      // check wether given coordinates will wrap to the row below
      let cap = (parseInt(current / 10, 10) + 1) * 10;
      cap -= 1;
      // because indexes
      // console.log(cap);
      if (current + ship.length - 1 > cap) {
        return "pick different coordinates";
      }
      while (coordinatesArray.length !== ship.length) {
        coordinatesArray.push(current);
        current += 1;
      }
    }
    // set the coordinates on the ship object and push ship object to fleet
    // before I add the coordinates to my ship object I first have to check in the fleet if any of the coordinates I'm trying to add to ship have already been used
    if (this.isShared(coordinatesArray)) {
      return "you have shared coordinates";
    } else {
      ship.coordinates = coordinatesArray;
      this.fleet.push(ship);
    }
  }
  isShared(array) {
    let shared = false;
    array.forEach((i) => {
      for (const obj of this.fleet) {
        if (obj.coordinates.includes(i)) {
          shared = true;
        }
      }
    });
    return shared;
  }
  receiveAttack(coordinates) {
    // i represents the a position on the board.
    let i = this.board.indexOf(coordinates);
    let hit = false;
    for (const obj of this.fleet) {
      if (obj.coordinates.includes(i)) {
        let target = obj.coordinates.indexOf(i);
        obj.hit(target);
        this.hits.push(i);
        hit = true;
      }
    }
    if (!hit) {
      this.misses.push(i);
    }
  }
  // game should be able to report whether or not all of their ships have been sunk.
  isFleetSunk() {
    // if all the ships are sunk, isFleetSunk method will return true else false.
    return this.fleet.every((ship) => {
      return ship.isSunk() === true;
    });
  }
}
// coordinates is an object. the object will have two variables position(A1) and dimension(can only be horizontal or vertical).
// when before coordinates can be saved to ship object, I have to make sure that they are valid.
// coordinates would follow a simple set of rules
// 1. ship coordinates must not warp to row below. 2. two ships can not share the same block on the grid.

// create Player
// It only makes sense if Player is its own Class
class Player {
  constructor(player, board) {
    this.playerName = player;
    this.playerBoard = board;
  }
  // player is ready function, checks whether player's fleet is 5;
}
// whats next for me is to implement game loop
// player one will set up ships on his board
// computer will set up ships on its board
// player one will click on random block on grid which will represent
// whether its a hit or a miss , the next turn goes to the computer
// once a ship been sunk, it will be displayed
export { GameBoard, Player, shipsArray };
