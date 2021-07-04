import React, { Component } from "react";
import PlayerStatus from "./PlayerStatus";
import { VscDebugRestart } from "react-icons/vsc";
import styles from "../gameControllerStyles.module.css";
import PlayerBoard from "./PlayerBoard";
import { GameBoard, Player, Ship } from "../logic";

export default class GameController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      human: new Player("Human", new GameBoard()),
      computer: new Player("Computer", new GameBoard()),
      gameOver: false,
      turn: "Human",
      // dimenstion state
      dimension: "horizontal",
      // preview state
      preview: { previewArray: [], isPreviewValid: null },
      // sorte
      shipsPositioned: 0,
      //   Im thinking of setting a state to keep track on the game's progress.
    };
    this.randomPlacement = this.randomPlacement.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.compsTurn = this.compsTurn.bind(this);
    this.isGameOver = this.isGameOver.bind(this);
    this.changeTurn = this.changeTurn.bind(this);
    this.disableButtons = this.disableButtons.bind(this);
    this.enableButtons = this.enableButtons.bind(this);
    this.changeDimension = this.changeDimension.bind(this);
    this.setPreview = this.setPreview.bind(this);
    this.resetPreview = this.resetPreview.bind(this);
    this.playerPlacement = this.playerPlacement.bind(this);
    this.createShip = this.createShip.bind(this);
  }
  // methods
  createShip(num) {
    let ship;
    switch (num) {
      case 0:
        ship = new Ship(5);
        break;
      case 1:
        ship = new Ship(4);
        break;
      case 2:
        ship = new Ship(3);
        break;

      default:
        ship = new Ship(2);
        break;
    }
    return ship;
  }
  //Todo Add restart game functionality
  playAgain() {
    this.setState({
      human: new Player("Human", new GameBoard()),
      computer: new Player("Computer", new GameBoard()),
      gameOver: false,
      turn: "Human",
      dimension: "horizontal",
      preview: { previewArray: [], isPreviewValid: null },
      shipsPositioned: 0,
    });
    //Todo Find a way to clear both playerBoards
    this.randomPlacement();
  }
  changeTurn() {
    this.setState((state) => {
      return { turn: state.turn === "Human" ? "Computer" : "Human" };
    });
  }
  //! this method does the same things as Gameboard.placeShips() instance method
  playerPlacement() {
    const previewState = this.state.preview;
    if (previewState.isPreviewValid && this.state.shipsPositioned !== 5) {
      let ship = this.createShip(this.state.shipsPositioned);
      ship.coordinates = previewState.previewArray;
      let humanStateClone = Object.assign({}, this.state.human);
      humanStateClone.playerBoard.fleet.push(ship);
      this.setState({ human: humanStateClone });
      this.setState((state) => {
        return { shipsPositioned: state.shipsPositioned + 1 };
      });
    }
  }
  randomPlacement() {
    const computerStateClone = Object.assign({}, this.state.computer);
    const board = computerStateClone.playerBoard.board;
    let shipsPlaced = 0;
    while (shipsPlaced !== 5) {
      let randoPosition = board[Math.round(Math.random() * 99)];
      let randoDimension = Math.round(Math.random() * 1);
      randoDimension = randoDimension ? "horizontal" : "vertical";
      let ship = this.createShip(shipsPlaced);
      computerStateClone.playerBoard.placeShip(ship, {
        position: randoPosition,
        dimension: randoDimension,
      });
      if (computerStateClone.playerBoard.fleet.length > shipsPlaced) {
        shipsPlaced += 1;
      }
    }
    this.setState({ computer: computerStateClone });
  }
  //   when block on computer board is clicked this function is run and computer board receives an attack.
  clickHandler(target, index) {
    const computerStateClone = Object.assign({}, this.state.computer);
    // method short-circuits if ships from human player are positioned
    if (this.state.shipsPositioned !== 5) {
      return;
    }
    // method short-circuits if chosen coordinates to attack has already been attacked previously
    if (
      computerStateClone.playerBoard.misses.includes(index) ||
      computerStateClone.playerBoard.hits.includes(index)
    ) {
      return console.log(
        `You've already picked these coordinates homes. Try different ones.`
      );
    }
    let coordinates = target.parentElement.id;
    computerStateClone.playerBoard.receiveAttack(coordinates);
    this.setState({ computer: computerStateClone });
    // after a hit check wether all the ships are sunk on computer
    if (this.isGameOver(this.state.computer)) {
      this.setState({ gameOver: true });
      console.log("game over Human guy wins");
    } else {
      // if human player doesn't win round, computer makes its turn.
      // disable computers buttons to prevent click while waiting for computer to make a move
      let boardContainer = target.parentElement.parentElement;
      let btnArray = boardContainer.querySelectorAll("button");
      this.disableButtons(btnArray);
      this.changeTurn();
      setTimeout(() => {
        this.compsTurn(this.state.human);
        this.enableButtons(btnArray);
      }, 700);
    }
  }

  compsTurn(player) {
    const humanStateClone = Object.assign({}, player);
    let target = Math.round(Math.random() * 99);
    while (
      humanStateClone.playerBoard.misses.includes(target) ||
      humanStateClone.playerBoard.hits.includes(target)
    ) {
      target = Math.round(Math.random() * 99);
    }
    let coordinates = humanStateClone.playerBoard.board[target];
    humanStateClone.playerBoard.receiveAttack(coordinates);
    this.setState({ human: humanStateClone });
    if (this.isGameOver(this.state.human)) {
      this.setState({ gameOver: true });
    } else {
      this.changeTurn();
    }
  }
  // function for disabling buttons
  disableButtons(btnList) {
    for (const btn of btnList) {
      btn.setAttribute("disabled", true);
    }
  }
  enableButtons(btnList) {
    for (const btn of btnList) {
      btn.removeAttribute("disabled");
    }
  }
  isGameOver(player) {
    return player.playerBoard.isFleetSunk();
  }
  changeDimension() {
    this.setState((state) => {
      return {
        dimension: state.dimension === "horizontal" ? "vertical" : "horizontal",
      };
    });
  }
  // this function will be modelled after placeShip()
  setPreview(coordinates) {
    // stop review if all ships have been positioned
    if (this.state.shipsPositioned === 5) {
      return;
    }
    let ship = this.createShip(this.state.shipsPositioned);
    // will take board index directly
    let startIndex = coordinates.position;
    let coordinatesArray = [];
    // it shouldnt be valid if it exceeds cap and when coordinates are shared
    let isValid = true;
    if (coordinates.dimension === "vertical") {
      let cap = 99;
      let indexEnd = startIndex + (ship.length - 1) * 10;
      if (indexEnd > cap) {
        isValid = false;
      }
      for (let i = startIndex; i <= indexEnd; i += 10) {
        coordinatesArray.push(i);
        if (i >= cap) {
          break;
        }
      }
    } else if (coordinates.dimension === "horizontal") {
      let cap = (parseInt(startIndex / 10, 10) + 1) * 10;
      cap -= 1;
      let indexEnd = startIndex + ship.length - 1;
      if (indexEnd > cap) {
        isValid = false;
      }
      for (let i = startIndex; i <= indexEnd; i++) {
        coordinatesArray.push(i);
        if (i >= cap) {
          break;
        }
      }
    }
    // isShared
    const fleet = this.state.human.playerBoard.fleet;
    for (const i of coordinatesArray) {
      for (const ship of fleet) {
        if (ship.coordinates.includes(i)) {
          isValid = false;
        }
      }
    }
    this.setState({
      preview: { previewArray: coordinatesArray, isPreviewValid: isValid },
    });
  }
  resetPreview() {
    this.setState({
      preview: { previewArray: [], isPreviewValid: null },
    });
  }
  componentDidUpdate() {
    // If game is over all buttons will become disabled
    if (this.state.gameOver) {
      const buttonsArray = document.querySelectorAll(".board button");
      this.disableButtons(buttonsArray);
    }
  }

  render() {
    return (
      <>
        {this.state.gameOver && (
          <div className={styles.winnerPanel}>
            <h1>Winner is {this.state.turn}</h1>
            <button
              onClick={() => {
                this.playAgain();
              }}
              className={styles.restart}
            >
              <VscDebugRestart />
              Restart
            </button>
          </div>
        )}
        <div className={styles["game-container"]}>
          <div className={styles.player}>
            <PlayerStatus
              title="Human"
              isGameOver={this.state.gameOver}
              player={this.state.human}
              dimension={this.state.dimension}
              changeDimension={this.changeDimension}
              shipsPositioned={this.state.shipsPositioned}
              turn={this.state.turn}
            />
            <PlayerBoard
              player={this.state.human}
              clickHandler={this.clickHandler}
              dimension={this.state.dimension}
              setPreview={this.setPreview}
              previewState={this.state.preview}
              resetPreview={this.resetPreview}
              playerPlacement={this.playerPlacement}
              compsTurn={this.compsTurn}
            />
          </div>
          <div className={styles.player}>
            <PlayerStatus
              title="Super-Computer"
              isGameOver={this.state.gameOver}
              player={this.state.computer}
              shipsPositioned={this.state.shipsPositioned}
            />
            <PlayerBoard
              player={this.state.computer}
              randoPlacement={this.randomPlacement}
              clickHandler={this.clickHandler}
            />
          </div>
        </div>
      </>
    );
  }
}
