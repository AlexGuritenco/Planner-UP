import {useState} from 'react'
import TaskModal from '../components/TaskModal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import TaskRow from '../components/TaskRow.jsx'
import PageLayout from '../components/PageLayout.jsx'
import CompletedRow from "../components/CompletedRow.jsx";
import TaskTable from '../components/TaskTable.jsx'

export default function Dashboard({tasks, onAdd, onDelete, onToggle, onEdit}) {
    const [showModal, setShowModal] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [deleteTask, setDeleteTask] = useState(null)
    const [toggleTask, setToggleTask] = useState(null)

    const pendingTasks = tasks.filter(task => !task.done)
    const completedTasks = tasks.filter(task => task.done)

    const handleEdit = (task) => {
        setEditingTask(task)
        setShowModal(true)
    }

    const handleClose = () => {
        setEditingTask(null)
        setShowModal(false)
    }

    const handleSave = (updatedTask) => {
        if (editingTask) {
            onEdit(editingTask.id, updatedTask)
        } else {
            onAdd(updatedTask)
        }
        setEditingTask(null)
    }

    const handleDeleteConfirm = () => {
        onDelete(deleteTask)
        setDeleteTask(null)
    }

    const handleToggleConfirm = () => {
        onToggle(toggleTask)
        setToggleTask(null)
    }

    return (
        <PageLayout className={"page-content"}>
            <TaskTable
                sectionID="todo-content"
                text="To-Do"
                columns={["No.", "Task", "Description", "Due", "Mark as Done", "Actions"]}
                items={pendingTasks}
                colSpanNr={6}
                message={"No pending tasks"}
                renderRow={(task, index) => (
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
                renderRow={(task, index) => (
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
                    existingTask={editingTask}
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
