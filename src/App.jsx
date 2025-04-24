import { useState, useEffect, use } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import './index.css'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(" some error happened")

 
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }
  , [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  return(
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
   <ul>
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          toggleImportance={() => {
            const updatedNote = { ...note, important: !note.important }
            noteService
              .update(note.id, updatedNote)
              .then(returnedNote => {
                setNotes(notes.map(n => (n.id !== note.id ? n : returnedNote)))
              })
              .catch(error => {
                setErrorMessage(`Note '${note.content}' was already deleted from server`)
                setTimeout(() => {
                  setErrorMessage(null)
                }, 5000)
                setNotes(notes.filter(n => n.id !== note.id))
              })
          }}
        />
      ))}
   </ul>
    <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
   </div>
  )
}
    

export default App

