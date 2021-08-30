import React from "react";
import { render } from "react-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import * as Icon from 'react-feather'

// Save button
const SaveBtn = () => <Icon.Save/>

function save() {
  var text = this.quill.getText();
  console.log("text", text)
}

/*
 * Custom toolbar component including the custom heart button and dropdowns
 */
const CustomToolbar = () => (
  <div id="toolbar">
    {/* <select className="ql-font">
      <option value="arial" selected>
        Arial
      </option>
      <option value="comic-sans">Comic Sans</option>
      <option value="courier-new">Courier New</option>
      <option value="georgia">Georgia</option>
      <option value="helvetica">Helvetica</option>
      <option value="lucida">Lucida</option>
    </select> */}
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
    <button className="ql-save">
      <SaveBtn />
    </button>
  </div>
);

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large", "huge"];
Quill.register(Size, true);

// // Add fonts to whitelist and register them
// const Font = Quill.import("formats/font");
// Font.whitelist = [
//   "arial",
//   "comic-sans",
//   "courier-new",
//   "georgia",
//   "helvetica",
//   "lucida"
// ];
// Quill.register(Font, true);

class Editor extends React.Component {
  state = { editorHtml: "" };

  handleChange = html => {
    this.setState({ editorHtml: html });
  };

  static modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        save: save
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

  render() {
    return (
      <div className="text-editor">
        <CustomToolbar />
        <ReactQuill
          value={this.state.editorHtml}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          modules={Editor.modules}
          formats={Editor.formats}
        />
      </div>
    );
  }
}

const App = () => (
  <div className="container">
    <h3 className="title">Editor by Sandra</h3>
    <Editor />
  </div>
);

render(<App />, document.getElementById("root"));
