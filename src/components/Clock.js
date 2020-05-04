import React, { Component } from "react";
import "../css/Home.css";

export default class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
          time: new Date().toLocaleString()
        };
      }

      componentDidMount() {
        this.intervalID = setInterval(
          () => this.tick(),
          1000
        );
      }
      componentWillUnmount() {
        clearInterval(this.intervalID);
      }

      tick() {
        this.setState({
          time: new Date().toLocaleString()
        });
      }

      render() {
        return (
          <p className="clock">
            {this.state.time}.
          </p>
        );
      }
}
