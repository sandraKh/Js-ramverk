import React, { Component } from "react";
import { render } from "react-dom";
import ReactQuill, { Quill } from "react-quill";
import { useQuill } from "react-quilljs";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import * as Icon from 'react-feather';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  withRouter
} from 'react-router-dom'
import SavedDocs from "./SavedDocs";
import { createBrowserHistory } from 'history';

export const browserHistory = createBrowserHistory();


// Save button
const SaveBtn = (id) => <SaveClick text = {id}/>

let textfield = "";

function save() {

  var text = this.quill.getText();
  textfield = text;
}

// Delete button
const DeleteBtn = (id) => <DeleteClick text = {id}/>

function deleteclick() {
  console.log("delete")
}

/*
 * Custom toolbar component including the custom heart button and dropdowns
 */
const CustomToolbar = (id) => (
  <div id="toolbar">
    
    <select className="ql-size">
      <option value="small">Size 1</option>
      <option value="medium" selected>
        Size 2
      </option>
      <option value="large">Size 3</option>
      <option value="huge">Size 4</option>
    </select>
    <select className="ql-color" />
    <button className="ql-clean" />
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-save">
      <SaveBtn dataParentToChild = {id}/>
    </button>
    <button className="ql-delete">
      <DeleteBtn dataParentToChild = {id}/>
    </button>
  </div>
);

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large", "huge"];
Quill.register(Size, true);


class DeleteClick extends React.Component {
  
  handleClick = () => {
      const doc = this.props.text.dataParentToChild.id
    console.log("handle click")
      axios.delete(`https://saku16-jsramverk.azurewebsites.net/${doc._id}`)
      .then(res => {
        console.log(res)
        browserHistory.push(`/`)
        window.location.reload();
      })
  }

  render() {
    return (
      <Icon.Trash onClick={this.handleClick}>
        Delete
      </Icon.Trash>

    );
  }
}


class SaveClick extends React.Component {
  
  handleClick = () => {

    
    const doc = this.props.text.dataParentToChild.id
    //First line will be the title
    var newTitle = textfield.split('\n')[0];

    if (typeof doc._id == 'undefined') {
      axios.post(`https://saku16-jsramverk.azurewebsites.net/`, {
        title: newTitle,
        content: textfield
      })
      .then(function (response) {
        console.log(response)
        browserHistory.push(`/${response.data._id}`)
        window.location.reload();

      })
      .catch(function (error) {
        console.log(error);
      });
    }
    else {
      axios.patch(`https://saku16-jsramverk.azurewebsites.net/${doc._id}`, {
        title: doc.title,
        content: textfield
      })
      .then(function (response) {
        console.log(response);
        browserHistory.push(`/${doc._id}`)
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  render() {
    return (
      <Icon.Save onClick={this.handleClick}>
        Spara
      </Icon.Save>

    );
  }
}



class SingleDoc extends React.Component {

  state = {
    persons: []
  }

  static modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        save: save,
        deleteclick: deleteclick
      }
    }
  };

  static formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color"
  ];
  

  componentDidMount() {
      axios.get(`https://saku16-jsramverk.azurewebsites.net/${this.props.match.params.id}`)
      .then(res => {
        const persons = res.data;
        console.log(persons)
        this.setState({ persons });
      })
  }

  title(title) {
    if (title != "") {
      return <h3 className="title">Editing document: "{this.state.persons.title}" </h3>;
    }
    return <h3 className="title">New Document</h3>;
  }


  render() {

    let comp;
    console.log("title", this.state.persons.title)
    if (typeof this.state.persons.title !== 'undefined') {

      comp = <h1 className="title"> Editing document: "{this.state.persons.title}"</h1>

    } else {

      comp = <h1 className="title">New Document</h1>

    }

    return (

      <div>
      <div className="container">
      {comp}
      <div className="text-editor">
        <CustomToolbar id = {this.state.persons}/>
        <SavedDocs/>
        <ReactQuill style={{whiteSpace: "pre-wrap"}}
          value={this.state.persons.content}
          onChange={this.handleChange}
          placeholder={this.state.persons.title}
          modules={SingleDoc.modules}
          formats={SingleDoc.formats}
        />
      </div>    
      </div>
      </div>
    )
  }
}

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={SingleDoc}/>
      <Route path="/:id" component={SingleDoc}/>
    </Switch>
  </Router>
  
);

render(<App />, document.getElementById("root"));
