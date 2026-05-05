import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [errors, setErrors] = useState({});

  
  const loadProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  
  const validate = () => {
    let temp = {};

    if (!name.trim()) temp.name = "This field is required";
    if (!description.trim()) temp.description = "This field is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

 
  const handleAdd = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/projects", { name, description });

      
      setName("");
      setDescription("");
      setErrors({});
      setShowModal(false);

      loadProjects();

    } catch (err) {
      console.error(err);

      if (err?.response?.data) {
        setErrors(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">

       
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>📁 Projects</h2>

          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Project
          </button>
        </div>

       
        <div className="row">
          {projects.map((p) => (
            <div key={p.id} className="col-md-4 mb-3">

              <div className="card shadow-sm h-100">
                <div className="card-body">

                  <h5 className="text-primary">{p.name}</h5>
                  <p className="text-muted">{p.description}</p>

                 
                  <div className="mb-2">
                    <span className="badge bg-secondary me-1">
                      Todo: {p.todoCount || 0}
                    </span>

                    <span className="badge bg-warning text-dark me-1">
                      InProgress: {p.inProgressCount || 0}
                    </span>

                    <span className="badge bg-success">
                      Done: {p.doneCount || 0}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">

                    <Link
                      to={`/projects/${p.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Tasks →
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>

        
        {showModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">

                
                <div className="modal-header">
                  <h5>Add Project</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

              
                <div className="modal-body">

              
              <input
              className={`form-control mb-1 ${errors.name ? "is-invalid" : ""}`}
                placeholder="Project Name"
                value={name}
                 onChange={(e) => {
                 setName(e.target.value);
                   setErrors((prev) => ({ ...prev, name: "" }));
               }}
               />

{errors.name && (
  <div className="text-danger mb-2">
    This field is required
  </div>
)}


<input
  className={`form-control mb-1 ${errors.description ? "is-invalid" : ""}`}
  placeholder="Description"
  value={description}
  onChange={(e) => {
    setDescription(e.target.value);
    setErrors((prev) => ({ ...prev, description: "" }));
  }}
/>


{errors.description && (
  <div className="text-danger">
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
                    onClick={handleAdd}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Projects;