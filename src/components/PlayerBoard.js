import React, { Component } from "react";
import { GiExplosionRays, GiShipWreck, GiWaterSplash } from "react-icons/gi";
import styles from "../playerBoard.module.css";
const classNames = require("classnames");

export default class PlayerBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.boardRef = React.createRef();
    this.renderMisses = this.renderMisses.bind(this);
    this.renderHits = this.renderHits.bind(this);
    this.renderSunkShips = this.renderSunkShips.bind(this);
  }
  renderMisses() {
    this.props.player.playerBoard.misses.forEach((i) => {
      let block = this.boardRef.current;
      block = block.children[i].firstElementChild;
      block.classList.add(styles.miss);
    });
    console.log(this.props.player.playerBoard.misses);
  }
  renderHits() {
    this.props.player.playerBoard.hits.forEach((i) => {
      let block = this.boardRef.current;
      block = block.children[i].firstElementChild;
      block.classList.add(styles.hit);
    });
  }
  renderSunkShips() {
    this.props.player.playerBoard.sunkShips.forEach((arr) => {
      for (const i of arr) {
        let block = this.boardRef.current;
        block = block.children[i].firstElementChild;
        block.classList.add(styles.sunk);
      }
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
          let block = this.boardRef.current;
          block = block.children[i].firstElementChild;
          block.classList.add(styles.ship);
        });
      }
    }
    // renders misses
    this.renderMisses();
    // renders hits
    this.renderHits();
    // render sunk ships
    this.renderSunkShips();
  }

  render() {
    const { player, clickHandler } = this.props;
    return (
      <div
        ref={this.boardRef}
        id={player.playerName + "-board"}
        className={classNames(styles["game-board"], "board")}
      >
        {player.playerBoard.board.map((el, index) => {
          return (
            <div id={el} className={styles.block} key={el + index}>
              <button
                className={styles.btn}
                onClick={(e) => {
                  if (player.playerName === "Computer") {
                    clickHandler(e.target, index, player);
                  }
                }}
              >
                {player.playerBoard.misses.includes(index) && 
                 (<GiWaterSplash />) || player.playerBoard.sunkShips.find( ar => { return ar.includes(index) }) &&
                    (<GiShipWreck/>) || player.playerBoard.hits.includes(index) &&
                    (<GiExplosionRays/>)
                }
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
