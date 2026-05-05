import React, { useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const { data, request } = useApi(api.get);
  const navigate = useNavigate();

  useEffect(() => {
    request("/projects");
  }, []);

  return (
    <Layout>
      <h2>Projects</h2>

      <div className="row">
        {data?.map(p => (
          <div className="col-md-4" key={p.id}>
            <div className="card p-3 shadow mb-3">
              <h5>{p.name}</h5>
              <p>{p.description}</p>

              <div>
                <span className="badge bg-primary">{p.todo} Todo</span>
                <span className="badge bg-warning mx-1">{p.inProgress}</span>
                <span className="badge bg-success">{p.done}</span>
              </div>

              <button
                className="btn btn-link mt-2"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                View Tasks →
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ProjectList;