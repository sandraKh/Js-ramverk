import React from "react";
import { render } from "react-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import * as Icon from 'react-feather';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link,
  NavLink,
  HashRouters,
  BrowserRouter
} from 'react-router-dom'
import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom'
import Homepage from "./Homepage";
import SavedDocs from "./SavedDocs";


const browserHistory = createBrowserHistory();


// Save button
const SaveBtn = (id) => <SaveClick text = {id}/>

let textfield = "";
let titlefield = "";


function save() {
var text = this.quill.root.innerHTML
var title = this.quill.getText();
  textfield = text;
  titlefield = title;
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
      <option value="medium" defaultValue>
        Size 2
      </option>
      <option value="large">Size 3</option>
      <option value="huge">Size 4</option>
    </select>
    <select className="ql-color" />
    <button className="ql-clean" />
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button aria-label='saveBtn' className="ql-save">
      <SaveBtn dataParentToChild = {id}/>
    </button>
    <button aria-label='deleteBtn' className="ql-delete">
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
      axios.delete(`https://saku16-jsramverk.azurewebsites.net/${doc._id}`)
      .then(res => {
        browserHistory.push(`${process.env.PUBLIC_URL}/`)
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
    var newTitle = titlefield.split('\n')[0];

    if (typeof doc._id == 'undefined') {
      axios.post(`https://saku16-jsramverk.azurewebsites.net/`, {
        title: newTitle,
        content: textfield
      })
      .then(function (response) {
        // browserHistory.push(`./editor/${response.data._id}`)
        browserHistory.push(`${process.env.PUBLIC_URL}/`)
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
        browserHistory.push(`./editor/${doc._id}`)
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
        this.setState({ persons });
      })
  }

  title(title) {
    if (title !== "") {
      return <h3 className="title">Editing document: "{this.state.persons.title}" </h3>;
    }
    return <h3 className="title">New Document</h3>;
  }


  render() {

    let comp;
    if (typeof this.state.persons.title !== 'undefined') {

      comp = <h1 className="title"> Editing document: "{this.state.persons.title}"</h1>

    } else {

      comp = <h1 className="title">New Document</h1>

    }

    return (
      <div>
      <Homepage/>
      <div className="container">
      {comp}
      <div className="text-editor">
        <div className="wrapper">
       <Link to={`${process.env.PUBLIC_URL}/`}>
        <button className="newBtn">
					Show All Documents
        </button>
        </Link>
        </div>
        <CustomToolbar id = {this.state.persons}/>
        <ReactQuill style={{whiteSpace: "pre-wrap"}}
          value={this.state.persons.content || '' }
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


function App() {
  return (
          <Router>
              <Switch>
              <Route exact path={`${process.env.PUBLIC_URL}/`}>
                  <Homepage/>
                  <SavedDocs/>
                  </Route>
                  <Route exact path={`${process.env.PUBLIC_URL}/editor/`} component={SingleDoc}>
                  </Route>
                  <Route path={`${process.env.PUBLIC_URL}/editor/:id` } component={SingleDoc}>
                  </Route>
              </Switch>
          </Router>
  );
}

export default App;

