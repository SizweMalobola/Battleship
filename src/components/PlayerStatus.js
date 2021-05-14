import React, { Component } from "react";
import styles from "../playerStatus.module.css";

export default class PlayerStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { title, isGameOver,player,dimension,changeDimension,shipsPositioned,turn } = this.props;
    return (
      <div>
        <h1 className={styles.title}>{title}</h1>
        {!isGameOver && (
          player.playerName === "Human"? <div className={styles.panel}>
            {shipsPositioned !== 5?<p className={styles.prompt}>position your ships</p>:<p className={styles.prompt}>Attack Computer's Board</p>}
            {shipsPositioned !==5?<div><button className={styles.btn} onClick={()=>{changeDimension()}}>Dimension : {dimension} </button><p className={styles.pill} >ships left to place: {5 - shipsPositioned}</p></div>:<div><p className={styles["turn-pill"]}>{turn === "Human"? "your turn": "waiting.."}</p><p className={styles.pill} >Ships Remaining: {5 - player.playerBoard.sunkShips.length}</p></div>}</div>
          :<div className={styles.panel}>
            {shipsPositioned !== 5? <p className={styles.prompt} >waiting...</p>:<p className={styles.prompt} >click on this board to sink their ships</p>}
            {shipsPositioned !== 5?<div>waiting for you to position your ships</div>:<div><p className={styles["turn-pill"]} >{turn === "Human"? "your turn": "waiting.."}</p><p className={styles.pill}>Ships Remaining: {5 - player.playerBoard.sunkShips.length}</p></div>}
          </div>
        )}
      </div>
    );
  }
}
