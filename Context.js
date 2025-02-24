import { createContext, useState } from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [focusTasks, setFocusTasks] = useState([]);
  const [labels, setLabels] = useState([])
  const [value, setValue] = useState('1')
  const [labelName, setLabelName] = useState('')
  const [name, setName] = useState(null)



  return (
    <TasksContext.Provider value={{ tasks, setTasks, labels, setLabels, value, setValue, labelName, setLabelName, focusTasks, setFocusTasks, name, setName }}>
      {children}
    </TasksContext.Provider>
  );
};
