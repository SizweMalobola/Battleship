import React, { Component } from "react";
import PlayerStatus from "./PlayerStatus";
import styles from "../gameControllerStyles.module.css";

export default class GameController extends Component {
  render() {
    return (
      <div className={styles["game_container"]}>
        <div className={styles.player}>
          <PlayerStatus title="Human" />
        </div>
        <div className={styles.player}>
          <PlayerStatus title="Super-Computer" />
        </div>
      </div>
    );
  }
}
