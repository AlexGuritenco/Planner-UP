import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import React, {useState} from 'react'
import {notification} from 'antd'
import {parseDueDate, serializeDueDate} from '../utils/dateUtils'
import type {Task} from "./types";

type getInitialFormProps = {
    title: string;
    description: string;
    due: Date;
}

type TaskInput = Omit<Task, "id">;

type TaskModalProps = {
    onClose: () => void;
    onSave: (task: TaskInput) => void;
    existingTask: Task | undefined;
}


function getInitialForm(existingTask?: Task): getInitialFormProps {
    return {
        title: existingTask?.title ?? '',
        description: existingTask?.description ?? '',
        due: existingTask?.due ? parseDueDate(existingTask.due) : new Date(),
    }
}

export default function TaskModal({onClose, onSave, existingTask}: TaskModalProps) {
    const [form, setForm] = useState(() => getInitialForm(existingTask))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!form.title.trim()) {
            notification.error({title: 'Title of task is required'})
            return
        }

        const taskToSave = {
            ...form,
            due: serializeDueDate(form.due),
        }
        onSave(taskToSave)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <h2 className="auth-card__title">{existingTask ? 'Edit Task' : 'Add Task'}</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <fieldset className="form__fieldset">
                        <legend className="form__legend">Task</legend>
                        <div className="form__group">
                            <label className="form__label" htmlFor="title">Title</label>

                            <input
                                className="form__input"
                                type="text"
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Assignment bla bla bla"
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label" htmlFor="description">Description</label>
                            <textarea
                                className="form__input"
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="e.g. Submit report"
                                rows={3}
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label" htmlFor="due">Due</label>
                            <DatePicker
                                selected={form.due}
                                onChange={(date: Date | null) => {
                                    if (!date) {
                                        return
                                    }
                                    setForm(prev => ({...prev, due: date}))
                                }}
                                dateFormat="dd/MM/yyyy"
                                className="form__input"
                                minDate={new Date()}
                                popperPlacement="bottom"
                            />
                        </div>
                        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>

                            <button className="button button--secondary form__submit" type="button" onClick={onClose}>
                                Cancel
                            </button>

                            <button className="button button--primary form__submit" type="submit">
                                {existingTask ? 'Save Changes' : 'Add Task'}
                            </button>

                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}
