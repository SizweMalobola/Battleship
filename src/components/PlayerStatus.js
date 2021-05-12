import React, { Component } from "react";
import style from "../playerStatus.module.css";

export default class PlayerStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { title, isGameOver,player,dimension,changeDimension } = this.props;
    return (
      <div>
        <h1 className={style.title}>{title}</h1>
        {!isGameOver && (
          <div className={style.panel}>
            <p className={style.prompt}>Place your pieces</p>
            <div>
              {" "}
              <button onClick={()=>{changeDimension()}}>Dimension : {dimension} </button>{" "}
              <span>Ships Remaining: { 5 - player.playerBoard.sunkShips.length}</span>{" "}
            </div>
          </div>
        )}
      </div>
    );
  }
}
