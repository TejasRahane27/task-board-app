import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import TaskBoard from "./pages/TaskBoard";
import TaskDetail from "./pages/TaskDetail";
import Layout from "./components/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import Projects from "./pages/Projects";
import { ThemeProvider } from "./context/ThemeContext";


function App() {
  return (
     <ThemeProvider>
    <Router>
      <Routes>

        
        <Route path="/" element={<Dashboard />} />

  
        <Route path="/projects" element={<Projects />} />

       
        <Route path="/projects/:id" element={<TaskBoard />} />

       
        <Route path="/tasks/:id" element={<TaskDetail />} />


        <Route path="/projects/:id" element={<TaskBoard />} />

      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;