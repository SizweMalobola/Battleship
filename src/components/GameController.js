import React, { Component } from "react";
import PlayerStatus from "./PlayerStatus";
import styles from "../gameControllerStyles.module.css";
import PlayerBoard from "./PlayerBoard";
import { GameBoard, Player, shipsArray } from "../logic";

export default class GameController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      human: new Player("Human", new GameBoard()),
      computer: new Player("Computer", new GameBoard()),
    };
    this.randomPlacement = this.randomPlacement.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
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
  clickHandler(e, player) {
    // onclikck board being clicked receives attack
    let coordinates = e.id;
    console.log(coordinates);
    this.setState({
      player: player.playerBoard.receiveAttack(coordinates),
    });
    console.log(player.playerBoard.misses);
  }

  componentDidUpdate() {
    console.log("did update");
  }
  componentDidMount() {
    console.log(this.state);
  }

  render() {
    // console.log(this.state);
    return (
      <div className={styles["game-container"]}>
        <div className={styles.player}>
          <PlayerStatus title="Human" />
          <PlayerBoard
            player={this.state.human}
            randoPlacement={this.randomPlacement}
            clickHandler={this.clickHandler}
          />
        </div>
        <div className={styles.player}>
          <PlayerStatus title="Super-Computer" />
          <PlayerBoard
            player={this.state.computer}
            randoPlacement={this.randomPlacement}
            clickHandler={this.clickHandler}
          />
        </div>
      </div>
    );
  }
}
// randomly place ships on players boards.
