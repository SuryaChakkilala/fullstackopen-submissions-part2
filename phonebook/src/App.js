import './App.css';
import {useState, useEffect} from 'react'
import personService from './persons'

const Filter = ({handleFilter}) => (
  <div>search name in the phonebook: <input onChange={handleFilter}/></div>
) 

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={ message.type === "error" ? "error" : "notification" }>
      {message.text}
    </div>
  )
}

const PersonForm = ({ addEntry, newName, handleNameChange, newNumber, handleNumberChange}) => (

  <form onSubmit={addEntry}>
        <div>
          name: <input  value={newName}
          onChange={handleNameChange}/>
        </div> 
        
        <div>
          number: <input  value={newNumber}
          onChange={handleNumberChange}/>
        </div>
        
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

const Persons = ({newFilter, persons, deleteContact}) => {
  
  const personsFiltered = persons.filter(person => {
      return person.name.toLowerCase().includes(newFilter.toLowerCase())
  })
  
  const personsToShow = newFilter.length === 0 ? persons : personsFiltered

  const displayPersons = personsToShow.map(person =>
      <div key={person.name}>
           {person.name} {person.number} 

          <button name={ person.name } 
                  id={ person.id }
                  onClick={ deleteContact }> delete</button>
           
           </div>
  )    
  
  return (
      <div>{displayPersons}</div>
  )
}

function App() {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ notificationMessage, setNotificationMessage] = useState(null)
  
useEffect(() => {
    personService
    .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

    const handleFilter = (event) => {
      setNewFilter(event.target.value)
  }    

    const deleteContact = (e) => {
      const id = e.target.id
      const name = e.target.name
      const msg = `Do you really want to delete ${ name }?`
    
      if (window.confirm(msg) === true) {
          personService
              .deletePerson(id)
              .then(deletedPerson => {
                setNotificationMessage({
                  "text": `${ name } was removed from server`,
                  "type": "error"
              })
              setTimeout(() => {
                  setNotificationMessage(null)
              }, 5000)

                  setPersons(persons.filter(person => person.id !== id))
              })
              .catch(error => {
                  setNotificationMessage({
                  "text": `${ name } was already removed from server`,
                  "type": "error"
              })
              setTimeout(() => {
                  setNotificationMessage(null)
              }, 5000)

                  setPersons(persons.filter(person => person.id !== id))
              })
      }
    }

    const findPerson = ()=>{
      const name = newName
      return persons.some(person => person.name.toLowerCase() === name.toLowerCase())
  }
  const duplicateContact = persons.find(p => p.name === newName);
  
  
  const addEntry = (event) => {
      event.preventDefault()
      if( duplicateContact ) {
           const msg =  `${ duplicateContact.name } is already added to phonebook, replace the old number with a new one?`
  
          if (window.confirm(msg) === true) {
              personService
                  .update(duplicateContact.id, {name: newName, number: newNumber})
                  .then(updatedPerson => {
  
                    setNotificationMessage({
                      "text": ` ${ duplicateContact.name }'s number is now updated`,
                      "type": "notification"
                  })
    
                  setTimeout(() => {
                      setNotificationMessage(null)
                  }, 5000)
                      setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
                      setNewName('')
                      setNewNumber('')
                  })
                  .catch(error => {
                    setNotificationMessage({
                      "text": `${error.response.data.error}`,
                      "type": "error"
                  })
    
                  setTimeout(() => {
                      setNotificationMessage(null)
                  }, 5000)
                        
                  })
          }
      }
  
      else if(newName.length > 0 && newNumber.length > 0 ){
  
        personService
        .create({name: newName, number: newNumber})
        .then(returnedPerson => {
          
          setNotificationMessage({
            text: `${ returnedPerson.name } is now in your phonebook`,
            type: "notification"
        })
  
        setTimeout(() => {
            setNotificationMessage(null)
        }, 5000)
  
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          
           
  
        }).catch(error => 
          {
            setNotificationMessage({
              "text": ` ${error.response.data.error}`,
              "type": "error"
          })

          setTimeout(() => {
              setNotificationMessage(null)
          }, 5000)}
              
          // console.log(error.response.data)
        )
  
      }
      else{
          alert("please complete the name and the number field")
      }
  
     
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

    
  return (
    <div>
      <h2>Phonebook</h2>

      { notificationMessage !== null ? <Notification message={ notificationMessage } /> : null }

     <Filter handleFilter={handleFilter} />

      <h2>add a new</h2>
    <PersonForm
      addEntry={addEntry}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber} 
      handleNumberChange={handleNumberChange}
    />

      <h2>Numbers</h2>
      <Persons newFilter={newFilter} persons={persons} deleteContact={deleteContact}/>  
    </div>
  )
}

export default App;
