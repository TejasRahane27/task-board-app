import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");


  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");


  const loadTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      const data = res.data;   
 
      setTask(res.data);

      setTitle(res.data.title || "");
      setDescription(res.data.description || "");
      setPriority(res.data.priority || "Low");
      setStatus(res.data.status || "Todo");

      if (res.data.dueDate) {
        setDueDate(res.data.dueDate.split("T")[0]);
      } else {
        setDueDate("");
      }

    } catch (err) {
      console.error(err);
    }
  };

 
  const loadComments = async () => {
    try {
 
      const res = await api.get(`/comments/task/${id}`);
      setComments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTask();
    loadComments();
  }, [id]);

  
const handleUpdate = async () => {
  try {
    await api.put(`/tasks/${id}`, {
      id: parseInt(id),
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      projectId: task.projectId
    });

    alert("Updated ");

    navigate(`/projects/${task.projectId}`);

  } catch (err) {
    console.error("Update Error:", err.response?.data);
    alert("Update failed ");
  }
};


  const handleDelete = async () => {
    if (!window.confirm("Delete task?")) return;

    await api.delete(`/tasks/${id}`);
    navigate("/projects");
  };

  
  const handleAddComment = async () => {
    if (!newComment) return;

    try {
      await api.post("/comments", {
        body: newComment,          
        author: "Tejas",           
        taskId: parseInt(id)       
      });

      setNewComment("");
      loadComments();

    } catch (err) {
      console.error("Comment error:", err.response?.data);
      alert("Comment add failed ");
    }
  };


  const handleDeleteComment = async (cid) => {
    await api.delete(`/comments/${cid}`);
    loadComments();
  };

  return (
    <Layout>
      <div className="container mt-4">

        <h2>Task Detail</h2>

        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

      
        <div className="card p-3 mb-3">

          <input className="form-control mb-2" value={title}
            onChange={(e) => setTitle(e.target.value)} />

          <input className="form-control mb-2" value={description}
            onChange={(e) => setDescription(e.target.value)} />

          <select className="form-select mb-2" value={priority}
            onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select className="form-select mb-2" value={status}
            onChange={(e) => setStatus(e.target.value)}>
            <option>Todo</option>
            <option>InProgress</option>
            <option>Done</option>
          </select>

          <input type="date" className="form-control mb-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)} />

          <div>
            <button className="btn btn-success me-2" onClick={handleUpdate}>
              Update
            </button>

            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

      
      {/* COMMENTS */}
<div className="card p-3">

  <h5> Comments</h5>


  <div className="d-flex mb-3">

    <input
      className="form-control me-2"
      placeholder="Write a comment..."   
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    />

    <button
      className="btn btn-primary"
      onClick={handleAddComment}
    >
      Add
    </button>

  </div>

 
  {comments.length === 0 ? (
    <p className="text-muted">No comments yet </p>
  ) : (
    comments.map(c => (
      <div
        key={c.id}
        className="border rounded p-2 mb-2"
      >

      
        <div className="fw-bold text-primary">
          {c.author || "Anonymous"}  
        </div>

        <div className="text-muted">
          {c.body}
        </div>

     
        <div className="text-end mt-1">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteComment(c.id)}
          >
            Delete
          </button>
        </div>

      </div>
    ))
  )}

</div>

      </div>
    </Layout>
  );
};

export default TaskDetail;