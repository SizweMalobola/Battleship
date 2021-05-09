import React, { Component } from "react";
import styles from "../playerBoard.module.css";

export default class PlayerBoard extends Component {
  render() {
    return <div className={styles["game-board"]}></div>;
  }
}
