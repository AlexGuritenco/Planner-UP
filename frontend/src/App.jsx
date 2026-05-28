import {useState} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Agenda from './pages/Agenda.jsx'
import StatsCard from './pages/StatsCard.jsx'
import Account from './pages/Account.jsx'
import './App.css'

const initialTasks = []

export default function App() {
    const [tasks, setTasks] = useState(initialTasks)

    const addTask = (task) => {
        // Instead of having id as numner -> we will have it as Date.now()
        setTasks(prev => [...prev, {...task, id: Date.now(), done: false}])
    }
    const deleteTask = (id) => {
        setTasks(prev => prev.filter(
            task => task.id !== id))
    }
    // we use this for changing the done status of the task( so it should:
    // copy the array and if the id matches, then it changes the done status
    const toggleTask = (id) => {
        setTasks(prev => prev.map(
            task => task.id === id ? {...task, done: !task.done} : task))
    }
    const editTask = (id, updatedTask) => {
        setTasks(prev => prev.map(
            task => task.id === id ? {...task, ...updatedTask} : task))
    }
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/dashboard" element={
                <Dashboard tasks={tasks} onAdd={addTask} onDelete={deleteTask} onToggle={toggleTask} onEdit={editTask}/>
            }/>
            <Route path="/agenda" element={<Agenda tasks={tasks}/>}/>
            <Route path="/stats" element={<StatsCard tasks={tasks}/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    )
}

