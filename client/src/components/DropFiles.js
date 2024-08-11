import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "../styles/styles.css";

const DropFiles = ({ projectId }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("projectId", projectId);

    try {
      await axios.post("http://localhost:8080/api/files", formData);
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      {/* <button onClick={handleDropdownToggle}>
        {showDropdown ? "Hide Options" : "Show Options"}
      </button> */}
      {showDropdown && (
        <div className="drop-files" {...getRootProps()}>
          <input {...getInputProps()} />
          <h3>Drag and drop files here, or click to select files</h3>
        </div>
      )}
    </div>
  );
};

export default DropFiles;
