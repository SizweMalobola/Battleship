import React, { Component } from "react";
import styles from "../headerStyles.module.css";

export default class Header extends Component {
  render() {
    return (
      <>
        <h1 className={styles.title}>Battleship_</h1>
        <div className={styles["disc_div"]}>
          <p>
            Feel the authentic thrill of the battle when you wage war on the
            high seas in the game of Battleship. Take charge and command your
            own fleet to defeat the enemy.
          </p>
        </div>
      </>
    );
  }
}
