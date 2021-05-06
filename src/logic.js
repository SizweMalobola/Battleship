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
  }
  placeShip(ship, coordinates) {
    // I add ship to battleshipesArray after it is successfully placed, else throw error.
    // check whether position is has already been taken
    // this.fleet.forEach(obj => {
    // })
    //
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
    console.log(coordinatesArray);
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
}
// coordinates is an object. the object will have two variables position(A1) and dimension(can only be horizontal or vertical).
// when before coordinates can be saved to ship object, I have to make sure that they are valid.
// coordinates would follow a simple set of rules
// 1. ship coordinates must not warp to row below. 2. two ships can not share the same block on the grid.
export { GameBoard };
