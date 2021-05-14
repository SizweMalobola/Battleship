import React, { Component } from "react";
import PlayerStatus from "./PlayerStatus";
import { VscDebugRestart } from "react-icons/vsc";
import styles from "../gameControllerStyles.module.css";
import PlayerBoard from "./PlayerBoard";
import { GameBoard, Player, shipsArray } from "../logic";

export default class GameController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      human: new Player("Human", new GameBoard()),
      computer: new Player("Computer", new GameBoard()),
      gameOver: false,
      turn: "Human",
      // dimenstion state
      dimension: "horizontal",
      // preview state
      preview: { previewArray:[],isPreviewValid:null},
      // sorte
      shipsPositioned: 0,
      //   Im thinking of setting a state to keep track on the game's progress.
    };
    this.randomPlacement = this.randomPlacement.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.compsTurn = this.compsTurn.bind(this);
    this.isGameOver = this.isGameOver.bind(this);
    this.changeTurn = this.changeTurn.bind(this);
    this.disableButtons = this.disableButtons.bind(this);
    this.enableButtons = this.enableButtons.bind(this);
    this.changeDimension = this.changeDimension.bind(this);
    this.setPreview = this.setPreview.bind(this);
    this.resetPreview = this.resetPreview.bind(this);
    this.playerPlacement = this.playerPlacement.bind(this);
  }
  //!   I don't trust this function but is seems to work for now
  changeTurn() {
    this.setState({
      turn: this.state.turn === "Human" ? "Computer" : "Human",
    });
    console.log(this.state.turn);
  }
  //! ship Placement for player
  playerPlacement(){
    const previewState = this.state.preview;
    if(previewState.isPreviewValid && this.state.shipsPositioned !== 5){

      let ship = shipsArray[this.state.shipsPositioned]; 
      ship.coordinates = previewState.previewArray;
      let humanStateClone =  JSON.parse(JSON.stringify(this.state.human));
      humanStateClone.playerBoard.fleet.push(ship);    
      this.setState({ human: humanStateClone})
      this.setState((state) =>{
        return {shipsPositioned: state.shipsPositioned + 1}
      })
    }
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
  clickHandler(target, index, player,man) {
    console.log(man.playerBoard.receiveAttack);
    // TODO make sure this only runs when player is human
    // run only if all ships are positioned
    if(this.state.shipsPositioned !== 5){
      return;
    }
    // onclikck board being clicked receives attack
    if (
      player.playerBoard.misses.includes(index) ||
      player.playerBoard.hits.includes(index)
    ) {
      return console.log(
        `You've already picked these coordinates homes. Try different ones.`
      );
    }
    let coordinates = target.parentElement.id;
    this.setState({
      player: player.playerBoard.receiveAttack(coordinates),
    });
    // after a hit check wether all the ships are sunk on computer
    if (this.isGameOver(player)) {
      this.setState({ gameOver: true });
      console.log("game over Human guy wins");
    } else {
      // disable computers buttons to prevent click while waiting for computer to make a move
     let boardContainer = target.parentElement.parentElement;
     let btnArray = boardContainer.querySelectorAll("button");
      this.disableButtons(btnArray);
      // run function that will let computer take a turn
      this.changeTurn();
      setTimeout(()=>{
        this.compsTurn(man)
        this.enableButtons(btnArray);
      }, 1000); 
    }
  }

  //TODO make this run independently  
  compsTurn(player) {
    console.log(player.playerBoard.receiveAttack);
    let target = Math.round(Math.random() * 99);
    while (
      player.playerBoard.misses.includes(target) ||
      player.playerBoard.hits.includes(target)
    ) {
      target = Math.round(Math.random() * 99);
    }
    let coordinates = player.playerBoard.board[target];
    // ! SUPER FIX THIS
    //  let humanStateClone =  JSON.parse(JSON.stringify(player));
    //   humanStateClone.playerBoard.receiveAttack(coordinates);
    this.setState({
       player: player.playerBoard.receiveAttack(coordinates),
    });
    //
    if (this.isGameOver(player)) {
      this.setState({ gameOver: true });
    } else {
      this.changeTurn();
    }
    
  }
    // function for disabling buttons
  disableButtons(btnList){
    for (const btn of btnList) {
       btn.setAttribute("disabled",true);
     }
  }
  enableButtons(btnList){
     for (const btn of btnList) {
       btn.removeAttribute("disabled");
     }
  }
  isGameOver(player) {
    return player.playerBoard.isFleetSunk();
  }
  changeDimension(){
    this.setState((state)=>{
    return  {dimension: state.dimension === "horizontal"? "vertical":"horizontal"}
    })
  }
    // this function will be modelled after placeShip()
  setPreview(coordinates){
    // stop review if all ships have been positioned
    if(this.state.shipsPositioned === 5){
      return
    }
    let ship = shipsArray[this.state.shipsPositioned]
    // will take board index directly
    let startIndex = coordinates.position;
    let coordinatesArray=[];
    // it shouldnt be valid if it exceeds cap and when coordinates are shared
    let isValid = true
    if(coordinates.dimension === "vertical"){
      let cap = 99;
      let indexEnd = startIndex + (ship.length - 1) * 10;
      for(let i = startIndex; i <= indexEnd; i += 10){
        coordinatesArray.push(i);
       if(i > cap){
          isValid = false;
        }
        if( i >= cap){
          break
        }
      }
    }else if (coordinates.dimension === "horizontal"){
      let cap = (parseInt(startIndex / 10, 10) + 1) * 10;
      cap -= 1;
      console.log(cap);
      let indexEnd = startIndex + ship.length -1;
      for(let i = startIndex; i <= indexEnd; i++){
        coordinatesArray.push(i);
        if(i > cap){
          isValid = false;
        }
        if( i >= cap){
          break
        }
      }
    }
    // isShared
   const fleet = this.state.human.playerBoard.fleet;
   for (const i of coordinatesArray) {
     for (const ship of fleet) {
     if(ship.coordinates.includes(i)){
       isValid = false;
     }
   }
   }
   this.setState({preview: {previewArray:coordinatesArray, isPreviewValid: isValid }} ) 
  }
  resetPreview(){
    this.setState({
      preview: { previewArray:[],isPreviewValid:null}
    })
  }
  componentDidUpdate() {
    console.log("did update");
    if (this.state.gameOver) {
      //  I want blocks not to respond, maybe I should add another class claaed
      const buttonsArray = document.querySelectorAll(".board button");
      this.disableButtons(buttonsArray);
    }
  }
  componentDidMount() {}

  render() {
    return (
      <>
        {this.state.gameOver && (
          <div className={styles.winnerPanel}>
            <h1>Winner is {this.state.turn}</h1>
            <button className={styles.restart}>
              <VscDebugRestart />
              Restart
            </button>
          </div>
        )}
        <div className={styles["game-container"]}>
          <div className={styles.player}>
            <PlayerStatus title="Human" isGameOver={this.state.gameOver}
            player={this.state.human} dimension={this.state.dimension} 
            changeDimension={this.changeDimension}
            shipsPositioned={this.state.shipsPositioned}
            turn={this.state.turn}
            />
            <PlayerBoard
              player={this.state.human}
              comp={this.state.computer}
              // randoPlacement={this.randomPlacement}
              clickHandler={this.clickHandler}
              dimension={this.state.dimension}
              setPreview={this.setPreview}
              previewState={this.state.preview}
              resetPreview={this.resetPreview}
              playerPlacement={this.playerPlacement}
              compsTurn={this.compsTurn}
            />
          </div>
          <div className={styles.player}>
            <PlayerStatus
              title="Super-Computer"
              isGameOver={this.state.gameOver}
              player={this.state.computer}
              shipsPositioned={this.state.shipsPositioned}

            />
            <PlayerBoard
              player={this.state.computer}
              man={this.state.human}
              randoPlacement={this.randomPlacement}
              clickHandler={this.clickHandler}
            />
          </div>
        </div>
      </>
    );
  }
}
// randomly place ships on players boards.

// how Ill go about making a preview of the blocks that have to be placed 
//  make an on hover event ,