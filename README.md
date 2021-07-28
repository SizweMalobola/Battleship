# Battleship

This is a recreation of the classic Battleship board game.

## Getting Started

Run `yarn install` to install all of the dependencies.

To start developing locally,

```
yarn start
```

to run the development server.

Run `yarn build` to create a production ready build.

## Rules

Users will place 5 different ships when the game starts. These include:

- Carrier: length 5
- Battleship: length 4
- Cruiser: length 3
- Destoryer X 2: length 2

Afterwards, the player and the ai will take turns attacking each other's boards.
Players will be informed that a ship is hit or sunken. The first player to sink all ships wins.

## Built With

- HTML
- CSS3
- JavaScript/ES6

### Frameworks

- ReactJS

### Libraries

- Jest
- React Icons

## Future Improvements

- AI can be better improved using a probability density function
- A state management library like Redux can be implemented to lessen the amount of state variables being passed as props
- Ability to play against another player locally or on the web

## Live Demo

[Live Demo Link](https://sizwemalobola.github.io/Battleship/)
