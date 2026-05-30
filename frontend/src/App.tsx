import {useEffect, useState} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Agenda from './pages/Agenda'
import StatsCard from './pages/StatsCard'
import Account from './pages/Account'
import './App.css'
import type {Task} from "./components/types";
import api from "./api";
import {notification} from "antd";
import ProtectedRoute from "./ProtectedRoutes";

const initialTasks: Task[] = []

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // if we are logged in, we get all the tasks once on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        // start the loading
        setIsLoading(true);
        setErrorMessage(null);

        api.get('/tasks')
            .then(res => setTasks(res.data.tasks ?? []))
            .catch(error => {
                setErrorMessage('Could not load tasks. Please try again.');
                console.error(error);
            })
            .finally(() => setIsLoading(false));
    }, []);

    // add - optimistic update: in case we catch an error, we roll back
    const addTask = async (task: Omit<Task, 'id' | 'done'>) => {
        // a temporary id
        const tempId = Date.now();
        const optimisticTask: Task = {...task, id: tempId, done: false};
        setTasks(prev => [...prev, optimisticTask]);
        try {
            const response = await api.post('/tasks', task);
            // and replace the temp id with the real one
            setTasks(prev => prev.map(
                task => task.id === tempId ? {...task, id: response.data.id} : task))
        } catch (error: any) {
            // roll back
            setTasks(prev => prev.filter(task => task.id !== tempId));
            notification.error({title: error.response?.data?.message ?? 'Failed to add task'});
        }
    }

    const deleteTask = async (id: number) => {
        // first save the current tasks
        const currentTasks = tasks;
        setTasks(prev => prev.filter(
            task => task.id !== id))
        try {
            await api.delete(`/tasks/${id}`);
        } catch (error: any) {
            // roll back
            setTasks(currentTasks);
            notification.error({title: error.response?.data?.message ?? 'Failed to delete task'});
        }
    }
    // we use this for changing the done status of the task( so it should:
    // copy the array and if the id matches, then it changes the done status
    // a patch request
    const toggleTask = async (id: number) => {
        const currentTasks = tasks;
        setTasks(prev => prev.map(
            task => task.id === id ? {...task, done: !task.done} : task))
        const target = tasks.find(t => t.id === id);
        try {
            await api.patch(`/tasks/${id}`, {done: !target?.done});
        } catch (error: any) {
            setTasks(currentTasks);
            notification.error({title: error.response?.data?.message ?? 'Failed to update task status'});
        }
    }
    // same thing but put this time
    const editTask = async (id: number, updatedTask: Partial<Task>) => {
        const currentTasks = tasks;
        setTasks(prev => prev.map(
            task => task.id === id ? {...task, ...updatedTask} : task))
        try {
            await api.put(`/tasks/${id}`, updatedTask);
        } catch (error: any) {
            setTasks(currentTasks);
            notification.error({title: error.response?.data?.message ?? 'Failed to update task'});
        }
    }
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={
                <Login/>
            }/>
            <Route path="/signup" element={
                <SignUp/>
            }/>
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard tasks={tasks} onAdd={addTask} onDelete={deleteTask} onToggle={toggleTask}
                               onEdit={editTask} loading={isLoading} errorMessage={errorMessage}/>
                </ProtectedRoute>

            }/>
            <Route path="/agenda" element={
                <ProtectedRoute>
                    <Agenda tasks={tasks}/>
                </ProtectedRoute>
            }/>
            <Route path="/stats" element={
                <ProtectedRoute>
                    <StatsCard tasks={tasks}/>
                </ProtectedRoute>
            }/>
            <Route path="/account" element={
                <ProtectedRoute>
                    <Account/>
                </ProtectedRoute>
            }/>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    )
}

