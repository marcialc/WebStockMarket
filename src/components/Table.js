import React, { Component } from "react";
import '../css/Table.css';

export default class Table extends Component {

  constructor(props){
    super(props);
    this.state = {
        companies: [ ],
    };
  }

  intervalID; 

  componentDidMount(){
    this.getData()
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  getData = () => {
    fetch("http://localhost:8080/api/company")
    .then(res => res.json())
    .then(data => {
      this.setState({ companies: data })
      this.intervalID = setTimeout(this.getData.bind(this), 3000);
    });
  }

  //An idea had to write
  renderTableData() {
    return this.state.companies.map((companies) => {
      var { id, name, acronym, price, change, chg, link } =  companies

      var changeStat = "neutral"
      chg = chg+"%"

      if(change !== 0)
      {
        changeStat = change < 0 ? "negative" : "positive"
        change = change < 0 ? change : "+"+change
        chg = change < 0 ? chg+"%"+" ↓" : chg+"%"+" ↑"
      }
     
      return (
        <tr key={id}>
             <td>{acronym}</td>
             <td>
               <a href={link} target="_blank" rel="noopener noreferrer" id="link"> 
                {name} 
               </a>
             </td>
             <td>{price}</td>
             <td id={changeStat}>{change}</td>
             <td id={changeStat}>{chg}</td>
        </tr>
      ) 
    })
  }

  renderTableHeader() {
    return (
      <tr>
        <th></th>
        <th>Company Name</th>
        <th>Price</th>
        <th>Change</th>
        <th>Chg %</th>
      </tr>
    )
  }

render() {

  var companies = this.state.companies;

  return (
    <div className="table-wrapper">
      <div style={{ backgroundColor: "white"}}>
        <table className='companies'>   
          <thead>
            <tr>
              <th></th>
              <th>Company Name</th>
              <th>Price</th>
              <th>Change</th>
              <th >Chg %</th>
            </tr>
          </thead>
          <tbody>                   
            {companies.map((companies) => {
              var changeStatus = 'neutral';
              var change = 0;
              var chg = 0;

              if(companies.price < companies.todayPrice) {
                changeStatus = 'negative';
                change = '-'+(companies.todayPrice - companies.price);
                chg = Math.round(100*((change/companies.todayPrice) * 100))/100+'% '+' ↓';

              }
              else if(companies.price > companies.todayPrice) {
                changeStatus = 'positive';
                change = '+'+(companies.price - companies.todayPrice);
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
                  <td id={changeStatus}>{Math.round(100*change)/100}</td>
                  <td 
                    id={changeStatus} 
                    style={{textAlign:"right", paddingRight:"30px", paddingLeft:"0", width:"120px"}}
                  >{chg}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
}
