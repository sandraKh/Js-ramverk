import React from 'react';
import axios from 'axios';
import "./style.css";

import { v4 as uuidV4 } from 'uuid'
import {Link } from 'react-router-dom';






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
    if (!user?.result?.email){
      return (
        <h1>Not logged in. Please log in to access the editor.</h1>
      )
    }
      else {
    return (
        <div className="DocumentList">
        <div className="wrapper">
          <Link to={`${process.env.PUBLIC_URL}/editor/${uuidV4()}`}>
            <button type="primary" className="newBtn">Create New Document</button>
         </Link>

        </div>
           <div className="list" id = "list">
          { this.state.element.map(person => 
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
}