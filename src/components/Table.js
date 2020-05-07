import React, { Component } from "react";
import '../css/Table.css';


export default class Table extends Component {

  constructor(props){
    super(props);
    this.state = {
        companies: [ ],
        update: [ ],
        sortType: 'asc',
        error: null,
        isLoaded: false,
    };
  }

  intervalID; 

  componentDidMount(){
    this.getPriceData()
    this.getData()
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  //Fetching the Data from the spring api
  getData = () => {
    fetch("http://localhost:8080/api/company")
    .then(res => res.json())
    .then(
      (data) => {
      this.setState({ 
        isLoaded: true,
        companies: data,
        update: data
      })
    },
    (error) => {
      this.setState({
        isLoaded: true,
        error
      });
    }
    );
  }

  //Updating the array update to only update the price in companies
  getPriceData = () => {
    fetch("http://localhost:8080/api/company")
    .then(res => res.json())
    .then(
      (data) => {
        this.setState({ 
          isLoaded: true,
          update: data
        })
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
    this.intervalID = setTimeout(this.getPriceData.bind(this), 3000);
  }

  sortTable(props) {

    let type = this.state.sortType;
    let x, y;

    const sortedCompanies = this.state.companies;
    sortedCompanies.sort((a,b) => {

      if(props === 'name'){
        x = a.name
        y = b.name
      } else if( props === 'price'){
        x = a.price
        y = b.price
      } else if( props === 'change'){
        x = a.change
        y = b.change
      } else if( props === 'chg'){
        x = a.chg
        y = b.chg
      }
      
      if(type === 'asc'){
        if(x < y) { return -1; }
        if(x > y) { return 1; }
        return 0;
      }else if(type === 'desc'){
        if(x > y) { return -1; }
        if(x < y) { return 1; }
        return 0;
      }
    });

    type = type === 'asc'? 'desc': 'asc';
    this.setState({ sortType: type, companies: sortedCompanies});
  }

  //resets the table to the original order
  resetTable(){
    this.setState({ companies : this.state.update, sortType: 'asc' })
  }

  //Displays Table Header
  renderTableHeader() {
    return (
      <tr>
        <th onClick={() => this.resetTable()}></th>
        <th onClick={() => this.sortTable('name')}>Company Name</th>
        <th onClick={() => this.sortTable('price')}>Price (USD)</th>
        <th onClick={() => this.sortTable('change')}>Change</th>
        <th onClick={() => this.sortTable('chg')}>Chg %</th>
      </tr>
    )
  }

  //Displays Table Data and creates the CHANGE and CHG
  renderTableData() {
    return this.state.companies.map((companies) => {

      //checks if the price has change to update the table
      let index = this.state.update.map(function(e) { 
          return e.name; 
        }).indexOf(companies.name); 

      if(companies.price !== this.state.update[index].price){
        companies.price = this.state.update[index].price
      }

      //If price has changed the change and chg should be 0 and neutral
      let changeStatus = 'neutral';
      let change = Math.round(100*(companies.price - companies.todayPrice))/100;
      let chg = 0;

      //Checking if price has change to the start of todays price, to update the change and chg
      if(companies.price < companies.todayPrice) {
        changeStatus = 'negative';
        chg = Math.round(100*((change/companies.todayPrice) * 100))/100+'% '+' ↓';
      }
      else if(companies.price > companies.todayPrice) {
        changeStatus = 'positive';
        chg = Math.round(100*((change/companies.todayPrice) * 100))/100+'% '+' ↑';
      }

      return (
        <tr key={companies.id}>
          <td>{companies.acronym}</td>
          <td>
            <a href={companies.link} target="_blank" rel="noopener noreferrer" id="link"> 
              {companies.name} 
            </a>
          </td>
          <td>{companies.price}</td>
          <td id={changeStatus}>{change}</td>
          <td 
            id={changeStatus} 
            //Added style to align the arrows
            style={{textAlign:"right", paddingRight:"30px", paddingLeft:"0", width:"120px"}}
          >{chg}</td>
      </tr>
      );
    })
  }

  render() {

    const{ error, isLoaded } = this.state;
    
    if (error) {
      return <div id="error">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div id="loading">Loading...</div>;
    } else {
      return (
        <div className="table-wrapper">
          <div style={{ backgroundColor: "white"}}>
            <table className='companies'>   
              <thead>
                {this.renderTableHeader()}
              </thead>
              <tbody>                   
                {this.renderTableData()}
              </tbody>
            </table>            
          </div>
        </div>
      );
    }
  }
}
