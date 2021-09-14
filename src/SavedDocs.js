import React from 'react';
import axios from 'axios';
import "./style.css";

import {Link, Router} from 'react-router-dom';


export default class SavedDocs extends React.Component {
  state = {
    persons: []
  }
  componentDidMount() {
    axios.get(`https://saku16-jsramverk.azurewebsites.net`)
      .then(res => {
        const persons = res.data;
        this.setState({ persons });
      })
  }


  render() {
    return (
        <div className="DocumentList">
        <div className="wrapper">
          <Link to={`${process.env.PUBLIC_URL}/editor/`}>
            <button type="primary" className="newBtn">Create New Document</button>
         </Link>
        </div>
           <div className="list" id = "list">
        { this.state.persons.map(person => 
        <ul>
        <li>
          <Link to={`${process.env.PUBLIC_URL}/editor/${person._id}`}>
            {person.title}
          </Link> 
        </li></ul>)}
        </div>
        </div>
    )
  }
}