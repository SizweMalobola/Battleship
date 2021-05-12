import React, { Component } from "react";
import PlayerStatus from "./PlayerStatus";
import { VscDebugRestart } from "react-icons/vsc";
import styles from "../gameControllerStyles.module.css";
import PlayerBoard from "./PlayerBoard";
import { GameBoard, Player, shipsArray } from "../logic";

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
  }
  //!   I don't trust this function but is seems to work for now
  changeTurn() {
    this.setState({
      turn: this.state.turn === "Human" ? "Computer" : "Human",
    });
    console.log(this.state.turn);
  }
  randomPlacement(player) {
    const board = player.playerBoard.board;
    let shipsPlaced = 0;
    let shipIndex = 0;
    while (shipsPlaced !== 5) {
      let randoPosition = board[Math.round(Math.random() * 99)];
      let randoDimension = Math.round(Math.random() * 1);
      randoDimension = randoDimension ? "horizontal" : "vertical";

      this.setState({
        player: player.playerBoard.placeShip(shipsArray[shipIndex], {
          position: randoPosition,
          dimension: randoDimension,
        }),
      });

      if (player.playerBoard.fleet.length > shipIndex) {
        shipIndex += 1;
        shipsPlaced += 1;
      }
    }
  }
  //   anything that has to do with updating state will be done here
  clickHandler(target, index, player) {
    // onclikck board being clicked receives attack
    if (
      player.playerBoard.misses.includes(index) ||
      player.playerBoard.hits.includes(index)
    ) {
      return console.log(
        `You've already picked these coordinates homes. Try different ones.`
      );
    }
    let coordinates = target.parentElement.id;
    this.setState({
      player: player.playerBoard.receiveAttack(coordinates),
    });
    // after a hit check wether all the ships are sunk on computer
    if (this.isGameOver(player)) {
      this.setState({ gameOver: true });
      console.log("game over Human guy wins");
    } else {
      // disable computers buttons to prevent click while waiting for computer to make a move
     let boardContainer = target.parentElement.parentElement;
     let btnArray = boardContainer.querySelectorAll("button");
      this.disableButtons(btnArray);
      // run function that will let computer take a turn
      this.changeTurn();
      setTimeout(()=>{
        this.compsTurn(this.state.human)
        this.enableButtons(btnArray);
      }, 1000); 
    }
  }
  // function for disabling buttons
  disableButtons(btnList){
    for (const btn of btnList) {
       btn.setAttribute("disabled",true);
     }
  }
  enableButtons(btnList){
     for (const btn of btnList) {
       btn.removeAttribute("disabled");
     }
  }
  compsTurn(player) {
    if (this.state.turn === "Computer") {
      console.log("is computer's turn");
    }
    let target = Math.round(Math.random() * 99);
    while (
      player.playerBoard.misses.includes(target) ||
      player.playerBoard.hits.includes(target)
    ) {
      target = Math.round(Math.random() * 99);
    }
    let coordinates = player.playerBoard.board[target];
    this.setState({
      player: player.playerBoard.receiveAttack(coordinates),
    });
    //
    if (this.isGameOver(player)) {
      this.setState({ gameOver: true });
      console.log("game over Super computer wins guy wins");
    } else {
      this.changeTurn();
    }
  }
  isGameOver(player) {
    return player.playerBoard.isFleetSunk();
  }
  changeDimension(){
    this.setState((state)=>{
    return  {dimension: state.dimension === "horizontal"? "vertical":"horizontal"}
    })
  }
  componentDidUpdate() {
    console.log("did update");
    if (this.state.gameOver) {
      //  I want blocks not to respond, maybe I should add another class claaed
      const buttonsArray = document.querySelectorAll(".board button");
      this.disableButtons(buttonsArray);
    }
  }
  componentDidMount() {}

  render() {
    return (
      <>
        {this.state.gameOver && (
          <div className={styles.winnerPanel}>
            <h1>Winner is {this.state.turn}</h1>
            <button className={styles.restart}>
              <VscDebugRestart />
              Restart
            </button>
          </div>
        )}
        <div className={styles["game-container"]}>
          <div className={styles.player}>
            <PlayerStatus title="Human" isGameOver={this.state.gameOver}
            player={this.state.human} dimension={this.state.dimension} changeDimension={this.changeDimension}/>
            <PlayerBoard
              player={this.state.human}
              randoPlacement={this.randomPlacement}
              clickHandler={this.clickHandler}
            />
          </div>
          <div className={styles.player}>
            <PlayerStatus
              title="Super-Computer"
              isGameOver={this.state.gameOver}
              player={this.state.computer}
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
// randomly place ships on players boards.

// how Ill go about making a preview of the blocks that have to be placed 
//  make an on hover event ,