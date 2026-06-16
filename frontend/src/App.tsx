import {useCallback, useEffect, useState} from 'react'
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
import {useTaskWebSocket} from "./hooks/useTaskWebSocket";

const initialTasks: Task[] = []

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // use useCallBack so we dont recreate on rerendering
    const fetchTasks = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        // start the loading
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const res = await api.get('/tasks');
            setTasks(res.data.tasks ?? []);
        } catch (error) {
            setErrorMessage('Could not load tasks. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load on mount
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useTaskWebSocket(setTasks, fetchTasks);


    // add - optimistic update: in case we catch an error, we roll back
    const addTask = async (task: Omit<Task, 'id' | 'done'>) => {
        // a temporary id
         const tempId = `temp_${Date.now()}`;
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

    const deleteTask = async (id: string) => {
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
    const toggleTask = async (id: string) => {
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
    const editTask = async (id: string, updatedTask: Partial<Task>) => {
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

