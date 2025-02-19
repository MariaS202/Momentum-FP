import { createContext, useState } from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState([])
  const [value, setValue] = useState('1')
  const [labelName, setLabelName] = useState('')

  return (
    <TasksContext.Provider value={{ tasks, setTasks, labels, setLabels, value, setValue, labelName, setLabelName }}>
      {children}
    </TasksContext.Provider>
  );
};