import {useState} from 'react'
import TaskModal from '../components/TaskModal'
import ConfirmDialog from '../components/ConfirmDialog'
import TaskRow from '../components/TaskRow'
import PageLayout from '../components/PageLayout'
import CompletedRow from "../components/CompletedRow";
import TaskTable from '../components/TaskTable'
import type {Task} from "../components/types";

type TaskInput = Omit<Task, "id" | "done">;

type DashboardProps = {
    tasks: Task[]
    onAdd: (task: TaskInput) => void
    onDelete: (taskId: string) => void
    onToggle: (taskId: string) => void
    onEdit: (taskId: string, updatedTask: TaskInput) => void
    loading: boolean
    errorMessage: string | null
}

export default function Dashboard({tasks, onAdd, onDelete, onToggle, onEdit, loading, errorMessage}: DashboardProps) {
    const [showModal, setShowModal] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [deleteTask, setDeleteTask] = useState<string | null>(null)
    const [toggleTask, setToggleTask] = useState<string | null>(null)

    const pendingTasks = tasks.filter(task => !task.done)
    const completedTasks = tasks.filter(task => task.done)

    const handleEdit = (task: Task) => {
        setEditingTask(task)
        setShowModal(true)
    }

    const handleClose = () => {
        setEditingTask(null)
        setShowModal(false)
    }

    const handleSave = (updatedTask: TaskInput) => {
        if (editingTask) {
            onEdit(editingTask.id, updatedTask)
        } else {
            onAdd(updatedTask)
        }
        setEditingTask(null)
    }

    const handleDeleteConfirm = () => {
        // onDelete(deleteTask)
        if (deleteTask !== null) {
            onDelete(deleteTask)
            setDeleteTask(null)
        }
    }

    const handleToggleConfirm = () => {
        if (toggleTask !== null) {
            onToggle(toggleTask)
            setToggleTask(null)
        }
    }
    // the loading logic
    if (loading) return <PageLayout className="page-content"><p>Loading tasks...</p></PageLayout>
    if (errorMessage) return <PageLayout className="page-content"><p>{errorMessage}</p></PageLayout>


    return (
        <PageLayout className={"page-content"}>
            <TaskTable
                sectionID="todo-content"
                text="To-Do"
                columns={["No.", "Task", "Description", "Due", "Mark as Done", "Actions"]}
                items={pendingTasks}
                colSpanNr={6}
                message={"No pending tasks"}
                renderRow={(task: Task, index: number) => (
                    <TaskRow
                        key={task.id}
                        task={task}
                        index={index}
                        onEdit={handleEdit}
                        onToggle={() => setToggleTask(task.id)}
                        onDelete={() => setDeleteTask(task.id)}
                    />
                )}
            />

            <div className="dashboard-actions">
                <button
                    className="button button--primary"
                    onClick={() => setShowModal(true)}
                >
                    Add Task
                </button>
            </div>

            <TaskTable
                sectionID={"done-content"}
                text={"Done This Week"}
                columns={["No.", "Task", "Description", "Completed"]}
                items={completedTasks}
                colSpanNr={4}
                message={"No completed tasks yet"}
                renderRow={(task: Task, index: number) => (
                    <CompletedRow
                        key={task.id}
                        task={task}
                        index={index}
                        onDelete={() => setDeleteTask(task.id)}
                    />
                )}
            />

            {showModal && (
                <TaskModal
                    key={editingTask?.id ?? 'new-task'}
                    onClose={handleClose}
                    onSave={handleSave}
                    existingTask={editingTask ?? undefined}
                />
            )}

            <ConfirmDialog
                open={deleteTask !== null}
                title="Delete Task"
                message="Are you sure you want to delete this task? This cannot be undone."
                onCancel={() => setDeleteTask(null)}
                onOK={handleDeleteConfirm}
                confirmLabel="Confirm"
            />
            <ConfirmDialog
                open={toggleTask !== null}
                title="Mark as Done"
                message="Mark this task as completed?"
                onCancel={() => setToggleTask(null)}
                onOK={handleToggleConfirm}
                confirmLabel="Confirm"
            />
        </PageLayout>
    )
}