import React, { Component } from "react";
import styles from "../playerBoard.module.css";

export default class PlayerBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.boardRef = React.createRef();
    this.renderMisses = this.renderMisses.bind(this);
    this.renderHits = this.renderHits.bind(this);
  }
  renderMisses() {
    this.props.player.playerBoard.misses.forEach((i) => {
      let block = this.boardRef.current;
      block = block.children[i];
      block.style.backgroundColor = "yellow";
    });
    console.log(this.props.player.playerBoard.misses);
  }
  renderHits() {
    this.props.player.playerBoard.hits.forEach((i) => {
      let block = this.boardRef.current;
      block = block.children[i];
      block.style.backgroundColor = "green";
    });
  }
  componentDidMount() {
    this.props.randoPlacement(this.props.player);
  }
  componentDidUpdate() {
    //   renders blocks with ships
    if (this.props.player.playerName === "Human") {
      for (const ship of this.props.player.playerBoard.fleet) {
        ship.coordinates.forEach((i) => {
          let block = document.querySelector("#Human-board");
          block = block.children[i];
          block.style.backgroundColor = "#1801C0";
        });
      }
    }
    // renders misses
    this.renderMisses();
    // renders hits
    this.renderHits();
  }

  render() {
    const { player, clickHandler } = this.props;
    return (
      <div
        ref={this.boardRef}
        id={player.playerName + "-board"}
        className={styles["game-board"]}
      >
        {player.playerBoard.board.map((el, index) => {
          return (
            <div
              id={el}
              className={styles.block}
              key={el + index}
              onClick={(e) => {
                if (player.playerName === "Computer") {
                  clickHandler(e.target, player);
                }
              }}
            ></div>
          );
        })}
      </div>
    );
  }
}
