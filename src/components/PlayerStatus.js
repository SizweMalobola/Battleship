import React, { Component } from "react";
import style from "../playerStatus.module.css";

export default class PlayerStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { title } = this.props;
    return (
      <div>
        <h1 className={style.title}>{title}</h1>
        <div className={style.panel}>
          <p className={style.prompt}>Place your pieces</p>
          <div>
            {" "}
            <button>Dimension : ____ </button>{" "}
            <span>5 Ships left to place</span>{" "}
          </div>
        </div>
      </div>
    );
  }
}
