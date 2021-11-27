import './App.css';

const Top = ({course}) => (
  <h1>{course}</h1>
)

  
const Total = ({part}) => {
  const total = part.reduce((a, value) => a + value.exercises, 0)
  return <h2>total {total}</h2>
}
  

const Part = ({p}) => (
  <p>{p.name} - {p.exercises}</p>
)

const Cont = ({parts}) => {
  return parts.map((part)=> <Part key={part.id} p={part} />)
}

const Course = ({course}) => {    
  return (
  <div>
    <Top course={course.name} />
    <Cont parts={course.parts}/>
    <Total part={course.parts} />
  </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App;
