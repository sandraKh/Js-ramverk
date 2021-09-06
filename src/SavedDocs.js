import React from 'react';
import axios from 'axios';

export default class SavedDocs extends React.Component {
    state = {
      persons: []
    }
    componentDidMount() {
      axios.get(`https://saku16-jsramverk.azurewebsites.net`)
        .then(res => {
          console.log(res.data)
          const persons = res.data;
          this.setState({ persons });
        })
    }
  
    render() {
      return (
        <div className= "savedDocs">
        <h4>Saved Documents:</h4>
        <ul>
          { this.state.persons.map(person => <li><a href={person._id}>{person.title}</a></li>)}
        </ul>
        <button className="newBtn"><a href="/">Create New Document</a></button>
        </div>
      )
    }
  }