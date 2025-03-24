import { createContext, useState } from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [focusTasks, setFocusTasks] = useState([]);
    const [labels, setLabels] = useState([])
    const [value, setValue] = useState('1')
    const [labelName, setLabelName] = useState('')
    const [name, setName] = useState(null)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [time, setTime] = useState(new Date())
    const [taskDate, setTaskDate] = useState(new Date())
    const [upTasks, setUpTasks] = useState([])
    const [username, setUsername] = useState('')

    return (
        <TasksContext.Provider value={{ tasks, setTasks, labels, setLabels, value, setValue, labelName, setLabelName, focusTasks, setFocusTasks, name, setName, email, setEmail, pass, setPass, time, setTime, taskDate, setTaskDate , upTasks, setUpTasks, username, setUsername}}>
        {children}
        </TasksContext.Provider>
    );
};
