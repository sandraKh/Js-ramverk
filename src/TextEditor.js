import React from "react";
import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams, Link } from "react-router-dom"
import { createBrowserHistory } from 'history';
import "./style.css";
import Homepage from "./Homepage";
import axios from 'axios';
import { saveAs } from 'file-saver';

const browserHistory = createBrowserHistory();

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
]


function DeleteBtn() {

  const { id: documentId } = useParams()


  function deleteBtn() {
 
    axios.delete(`https://saku16-jsramverk.azurewebsites.net/${documentId}`)
    .then(res => {
      browserHistory.push(`${process.env.PUBLIC_URL}/`)
      window.location.reload();

    })
  }

  return (
    <div className="wrapper">
      <button onClick={deleteBtn} className="newBtn">
          Delete Document
      </button>
    </div>
  );
}

function PermissionForm(props) {

  const user = JSON.parse(localStorage.getItem('profile'));
  const nameEl = React.useRef(null);
  const [email, setEmail] = useState({
    email: {
      recipient: '',
      sender: 'sandra.kullar@gmail.com',
      subject: 'You have been invited to Sandras text Editor to edit a document.',
      text: 'Hello. You have been invited to edit a document in Sandras text editor. Please click the link to visit the website: http://www.student.bth.se/~saku16/editor/ '
    }
  }
)
  let defaultPermissions = "";
  const { id: documentId } = useParams()

  const handleSubmit = e => {
    e.preventDefault();
    if(nameEl.current.value === "") {
      alert("Value can not be empty. Please try again.");
    } else {
      axios.put(`https://saku16-jsramverk.azurewebsites.net/${documentId}`, {
        access: nameEl.current.value
      })
      .then(function (response) {
        alert("User Permissions saved");
        e.preventDefault();
        axios.get(`https://saku16-jsramverk.azurewebsites.net/send-email?recipient=${nameEl.current.value}&sender=${email.email.sender}&topic=${email.email.subject}&text=${email.email.text}`)
        .then(function (response) {
          e.preventDefault();
        })
           //query string url
        .catch(err => console.error(err))
        e.preventDefault();
       // window.location.reload();

      })
      .catch(function (error) {
        console.log(error);
      });
    }

  };


  return (
     <form onSubmit={handleSubmit}>
       <label>Add user permission with email:
         <input type="text" ref={nameEl} defaultValue ={""}/>
       </label>
       <input type="submit" name="Submit" />
     </form>
   );
}



export default function TextEditor() {

  const { id: documentId } = useParams()
  const [socket, setSocket] = useState()
  const [permissions, setPermssions] = useState(["empty"])
  const [creator, setCreator] = useState("empty")
  const [edit, setEdit] = useState(false)
  const [quill, setQuill] = useState()
  let [comments, setComments] = useState([]);
  let [commentIndex, setCommentIndex] = useState([]);
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
  axios.get(`https://saku16-jsramverk.azurewebsites.net/${documentId}`)
      .then(res => {
        if(typeof res.data.access !== []) {
          setPermssions( res.data.access );
        }
        if(typeof res.data.comments !== []) {
          setComments( res.data.comments );
        }
      })
    }, [])

    useEffect(() => {
      axios.get(`https://saku16-jsramverk.azurewebsites.net/${documentId}`)
          .then(res => {

            if ( typeof res.data.title == "undefined") {
              setEdit( true );
            }
          })
        }, [])

    useEffect(() => {

        axios.get(`https://saku16-jsramverk.azurewebsites.net/${documentId}`)
        .then(res => {

            setCreator( res.data.creator );
            if (typeof res.data.creator == "undefined") {
              axios.put(`https://saku16-jsramverk.azurewebsites.net/setCreator/${documentId}`, {
                creator: user?.result?.email
              })
            }
        })

      }, [])

  useEffect(() => {
  
    // const s = io("http://localhost:3001")
    const s = io("https://saku16-jsramverk.azurewebsites.net/")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
        quill.setContents(document)
        quill.enable()
    })

    socket.emit("get-document", documentId)
  }, [socket, quill, documentId])

  useEffect(() => {
    if (socket == null || quill == null) return
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {

       clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return
    const handler = delta => {
        quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])


  const createAndDownloadPdf = (e) => {
    e.preventDefault()

    let value = {
      content:  quill.root.innerHTML,
    }

      axios.post('https://saku16-jsramverk.azurewebsites.net/create-pdf', value)
      .then(() => axios.get('https://saku16-jsramverk.azurewebsites.net/fetch-pdf', { responseType: 'blob' }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

        saveAs(pdfBlob, 'newPdf.pdf');
      })
  }

  const commentQuill = (e) => {
    var metaData = [];
    e.preventDefault()
    var prompt = window.prompt("Please enter Comment", "");
    var txt;
    if (prompt == null || prompt === "") {
      txt = "User cancelled the prompt.";
    } else {
      var range = quill.getSelection();
      if (range) {
        if (range.length === 0) {
          alert("Please select text", range.index);
        } else {
          var text = quill.getText(range.index, range.length);
          metaData.push({ range: range, comment: prompt });
          quill.formatText(range.index, range.length, {
            background: "#fff72b"
          });
          axios.put(`https://saku16-jsramverk.azurewebsites.net/setComment/${documentId}`, {
            comments: metaData
          }).then((res) => {
            axios.get(`https://saku16-jsramverk.azurewebsites.net/${documentId}`)
            .then(result => {
                setComments( result.data.comments );
            })
          })


        }
      } else {
        alert("User cursor is not in editor");
      }
    
  }
  }

  const commentClick = (event, range) => {
    quill.setSelection(range.index, range.length);
  
  }

  if(!user?.result?.name) {
    return (
      <h1>Not logged in. Please log in to access the editor.</h1>
    )
  } else {
    if( creator === user?.result?.email || (edit === true) || (permissions?.includes(user?.result?.email))) {

      return <>
      <Homepage/>
     <h1>Editing Document</h1>
<div className="buttons">
     <div className="wrapperTextEditor">
       <Link to={`${process.env.PUBLIC_URL}/`}>
       <button className="newBtn" onClick={createAndDownloadPdf}>
         Download As PDF
         </button>
         <button className="newBtn">
         Show All Documents
         </button>
       </Link>
       <DeleteBtn/>
       
       
       <div className="userPerm">
       <h4>Other users invited to the document: </h4>
    { permissions ? permissions.map((permission)=>(
        <div className="items" key={permission}>
            <div className="text-center">
                <p className="fs-12">{permission}</p>
            </div>
        </div>
      )) : <p>List is empty</p>}
      </div>

    <div className="permissionForm"><PermissionForm/></div>
    </div>
       <div className="commentField">
       
       <button className="newBtn" onClick={commentQuill}>Comment Document</button>
       <div>
       { comments ? comments.map((item, index)=>(
          <div className="comments">
            <p className='comment-link' onClick={(e) => { commentClick(e, item[0].range) }}><li class='list-group-item'> {item[0].comment} </li></p>
          </div>
      )) : <p>No comments</p>}
      </div>
      </div>
      </div>
     <div className="container" ref={wrapperRef}></div>
     </>
  
     
    } else {
      return (
        <div>
        <Homepage/>
      <h3>You do not have permission to view this document</h3>
      </div>
      );
    } 
  }

}