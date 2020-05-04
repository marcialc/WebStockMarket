import React, { Component } from "react";
import '../css/Home.css';
import Table from "../components/Table";
import Clock from "../components/Clock";

export default class Home extends Component {

  render() {
    return (
      <div className="home-wrapper">
        <p className="home-title">
          Web Stock Market
        </p>
        <Clock />
        <Table />
      </div>
    );
  }
}
