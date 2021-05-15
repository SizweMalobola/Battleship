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
    this.showPreview = this.showPreview.bind(this);
  }
  renderMisses() {
    this.props.player.playerBoard.misses.forEach((i) => {
      let block = this.boardRef.current;
      block = block.children[i].firstElementChild;
      block.classList.add(styles.miss);
    });
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
  // apparently I cant get access the other parts of th preview object
  showPreview(){
let block = this.boardRef.current.children
block = Array.from(block);
block.forEach((child,index) => {
  if(this.props.previewState.previewArray.includes(index)){
    child.firstElementChild.classList.toggle(styles.preview,true);
  }else{
   child.firstElementChild.classList.toggle(styles.preview,false);
  }
})
}
  componentDidMount() {
    if(this.props.player.playerName === "Computer"){
      this.props.randoPlacement();
    }
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
    // render preview
    if(this.props.player.playerName === "Human"){
      this.showPreview(this.props.previewState);
    }
    console.log(this.props.player.playerBoard.fleet);
  }

  render() {
    const { player,clickHandler,dimension,setPreview,resetPreview,playerPlacement} = this.props;
    return (player.playerName === "Human"?
    <div ref={this.boardRef} id={player.playerName + "-board"} className={classNames(styles["game-board"], "board")} onMouseOut={()=> {resetPreview();}} >
      {player.playerBoard.board.map((b,index)=>{return(<div id={b} className={styles.block} key={b+index}>
        <button className={styles.btn} onClick={()=>{playerPlacement()}} onMouseOver={()=>{setPreview({position:index,dimension:dimension})}}>
           {player.playerBoard.misses.includes(index) && (<GiWaterSplash />) || player.playerBoard.sunkShips.find( ar => { return ar.includes(index) }) && (<GiShipWreck/>) || player.playerBoard.hits.includes(index) && (<GiExplosionRays/>)}
        </button>
      </div>)})}
    </div>
    :<div ref={this.boardRef} id={player.playerName + "-board"} className={classNames(styles["game-board"], "board")} >
      {player.playerBoard.board.map((b,index)=>{return(<div id={b} className={styles.block} key={b+index}>
        <button className={styles.btn} onClick={(e)=>{clickHandler(e.target,index)}}>
           {player.playerBoard.misses.includes(index) && (<GiWaterSplash />) || player.playerBoard.sunkShips.find( ar => { return ar.includes(index) }) && (<GiShipWreck/>) || player.playerBoard.hits.includes(index) && (<GiExplosionRays/>)}
        </button>
      </div>)})}
    </div>)
  }
}
