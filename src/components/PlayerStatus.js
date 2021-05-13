import React, { Component } from "react";
import { shipsArray } from "../logic";
import style from "../playerStatus.module.css";

export default class PlayerStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { title, isGameOver,player,dimension,changeDimension,shipsPositioned,turn } = this.props;
    return (
      <div>
        <h1 className={style.title}>{title}</h1>
        {!isGameOver && (
          player.playerName === "Human"? <div className={style.prompt}>
            {shipsPositioned !== 5?<p>position your ships</p>:<p>Attack Computer's Board</p>}
            {shipsPositioned !==5?<div><button onClick={()=>{changeDimension()}}>Dimension : {dimension} </button><p>ships left to place: {5 - shipsPositioned}</p></div>:<div><p>{turn === "Human"? "your turn": "waiting.."}</p><p>Ships Remaining: {5 - player.playerBoard.sunkShips.length}</p></div>}</div>
          :<div className={style.prompt}>
            {shipsPositioned !== 5? <p>waiting...</p>:<p>click on this board to sink their ships</p>}
            {shipsPositioned !== 5?<div>waiting for you to position your ships</div>:<div><p>{turn === "Human"? "your turn": "waiting.."}</p><p>Ships Remaining: {5 - player.playerBoard.sunkShips.length}</p></div>}
          </div>
        )}
      </div>
    );
  }
}
