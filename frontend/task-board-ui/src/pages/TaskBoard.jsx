import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const TaskBoard = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

 
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");


  const [errors, setErrors] = useState({});


  const loadTasks = async () => {
    try {
      const res = await api.get(`/tasks?projectId=${id}`);
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Tasks load failed ❌");
    }
  };

  useEffect(() => {
    if (id) loadTasks();
  }, [id]);

  
  const validate = () => {
    let temp = {};

    if (!title.trim()) temp.title = true;
    if (!description.trim()) temp.description = true;
    if (!priority) temp.priority = true;
    if (!status) temp.status = true;
    if (!dueDate) temp.dueDate = true;

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

 
  const handleAddTask = async () => {
    if (!validate()) return; 

    try {
      await api.post("/tasks", {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        projectId: parseInt(id),
      });

      setTitle("");
      setDescription("");
      setPriority("Low");
      setStatus("Todo");
      setDueDate("");
      setErrors({});
      setShowModal(false);

      loadTasks();
    } catch (err) {
      console.error(err);
      alert("Task add failed ");
    }
  };

 
  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete task?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">

     
        <div className="d-flex justify-content-between mb-3">
          <h2>Task Board</h2>

          <div>
            <button
              className="btn btn-secondary me-2"
              onClick={() => navigate("/projects")}
            >
              ← Back
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Add Task
            </button>
          </div>
        </div>

        
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No Tasks Found 
                </td>
              </tr>
            ) : (
              tasks.map(t => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.description}</td>

                  <td>
                    <span className={
                      t.priority === "High"
                        ? "badge bg-danger"
                        : t.priority === "Medium"
                        ? "badge bg-warning text-dark"
                        : "badge bg-secondary"
                    }>
                      {t.priority}
                    </span>
                  </td>

                  <td>{t.status}</td>

                  <td className={
                    t.dueDate && new Date(t.dueDate) < new Date()
                      ? "text-danger"
                      : ""
                  }>
                    {t.dueDate || "-"}
                  </td>

                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => navigate(`/tasks/${t.id}?mode=view`)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => navigate(`/tasks/${t.id}?mode=edit`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

   
        {showModal && (
          <div className="modal d-block">
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5>Add Task</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">

            
                  <input
                    className="form-control mb-1"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && (
                    <div className="text-danger mb-2">
                      This field is required
                    </div>
                  )}

            
                  <input
                    className="form-control mb-1"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {errors.description && (
                    <div className="text-danger mb-2">
                      This field is required
                    </div>
                  )}

                  
                  <select
                    className="form-select mb-1"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  {errors.priority && (
                    <div className="text-danger mb-2">
                      This field is required
                    </div>
                  )}

                
                  <select
                    className="form-select mb-1"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Todo</option>
                    <option>InProgress</option>
                    <option>Done</option>
                  </select>
                  {errors.status && (
                    <div className="text-danger mb-2">
                      This field is required
                    </div>
                  )}

                 
                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  {errors.dueDate && (
                    <div className="text-danger mt-1">
                      This field is required
                    </div>
                  )}

                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={handleAddTask}
                  >
                    Save
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default TaskBoard;