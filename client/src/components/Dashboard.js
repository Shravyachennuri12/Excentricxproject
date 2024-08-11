import React, { useState } from "react";
import "../styles/styles.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Link } from "react-router-dom";

const projects = [
  { id: 1, name: "Portfolio website" },
  { id: 2, name: "Landing page" },
  { id: 3, name: "CodeCrafters" },
  { id: 4, name: "WebWizards" },
  { id: 5, name: "E-commerce" },
  { id: 6, name: "Online code editor" },
  { id: 7, name: "Blog page" },
  { id: 8, name: "Bytebeat solutions" },
  { id: 9, name: "To-do list" },
  { id: 10, name: "Weather forecast" }
];

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*,application/pdf",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    onDragOver: () => console.log("Dragging over drop zone"), 
    onDragLeave: () => console.log("Drag left drop zone"), 
  });

  const handleUpload = async () => {
    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });
      formData.append("projectId", selectedProject.id); 

      const response = await axios.post(
        "http://localhost:8080/api/files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <b>
          <h1>Projects</h1>
        </b>
        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className={selectedProject?.id === project.id ? "active" : ""}
            >
              {project.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {selectedProject ? (
          <div>
            <b>
              <h2>{selectedProject.name}</h2>
            </b>
            <p>Details about {selectedProject.name}</p>
            <Link to={`/project-details/${selectedProject.id}`} className="btn">
  View Project Details
</Link>

          </div>
        ) : (
          <b>
            <p>Select a project to view details</p>
          </b>
        )}
      </div>
      <div className="drop-files" {...getRootProps()}>
        <input {...getInputProps()} />
        <h3>Drag and drop files here, or click to select files</h3>
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
        <div className="file-previews">
          {files.map((file) => (
            <div key={file.name} className="file-preview">
              {file.type.startsWith("image/") ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  style={{ width: 100, height: 100 }}
                />
              ) : (
                <div>{file.name}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
