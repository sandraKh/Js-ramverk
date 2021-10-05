import React from 'react';
import axios from 'axios';
import "./style.css";

import { v4 as uuidV4 } from 'uuid'
import {Link } from 'react-router-dom';

import GraphQl from './GraphQl';





export default class SavedDocs extends React.Component {
  state = {
    element: [],
  }
  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('profile'));
    
    axios.get(`https://saku16-jsramverk.azurewebsites.net/`)
      .then(res => {
        var data = res.data
        var loopData = ''
        var i ;
        var u = 0;
        var element = []

        for(i=0; i < data.length; i++){
          if( user?.result?.email === data[i].creator || (data[i].access?.includes(user?.result?.email)))
             
            element.push({title: data[i].title , _id: data[i]._id})
 
        }
        this.setState( {element} );
      })
  }


  render() {

  const user = JSON.parse(localStorage.getItem('profile'));

  //  const listItem = [];
  //  const creator = [];
  //   this.state.persons.map((number) => listItem.push(number.access));

  // this.state.persons.map((number) => creator.push(number.creator) );

  //   console.log("list", listItem)
  //   console.log("creator", creator)

    return (
        <div className="DocumentList">
        <GraphQl/>
        <div className="wrapper">
          <Link to={`${process.env.PUBLIC_URL}/editor/${uuidV4()}`}>
            <button type="primary" className="newBtn">Create New Document</button>
         </Link>

        </div>
           <div className="list" id = "list">
  
        {/* { this.state.persons.map(person => 
        <ul>
        <li>
          <Link to={`${process.env.PUBLIC_URL}/editor/${person._id}`}>
            {person.title}
          </Link> 
        </li></ul>)} */}
          { this.state.element.map(person => 
        <ul class="ulA">
        <li class="linkA">
          <Link to={`${process.env.PUBLIC_URL}/editor/${person._id}`}>
            {person.title}
          </Link> 
        </li></ul>)}
        </div>
        </div>
    )
  }
}