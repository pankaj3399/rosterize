import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listHeads } from "../../api/Department";
import { listSkills } from "../../api/Skill";

import { useAuth } from "../../context/AuthContext";
import Loader from "../../Components/Loader/Loader";
import {
  listDepartmentHeadProjects,
  searchDepartmentHeadProject,
  deleteDepartmentHeadProject,
} from "../../api/Project";

const Project = () => {
  const { authData } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const {
    data: projectsData,
    isLoading: loadingProjects,
    error: errorProjects,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => listDepartmentHeadProjects(authData._id),
    enabled: !!authData.company,
    retry: 0,
  });

  const searchProjectMutation = useMutation({
    mutationFn: searchDepartmentHeadProject,
    onSuccess: (data) => {
      setProjects(data);
    },
    onError: (error) => {
      console.error("Search project failed:", error);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteDepartmentHeadProject,
    onSuccess: (data) => {
      setMessage("Project deleted successfully");
      setError("");
      queryClient.invalidateQueries("projects");
    },
    onError: (error) => {
      setMessage("");
      setError(error.message);
      console.error("Delete project failed:", error);
    },
  });

  const handleDeleteProject = (projectId) => {
    deleteProjectMutation.mutate(projectId);
  };

  useEffect(() => {
    // debounce search
    const timeoutId = setTimeout(() => {
      searchProjectMutation.mutate({
        departmentHead_id: authData._id,
        projectName,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [projectName]);

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  return (
    <div className="p-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Search Project</h2>
        <input
          type="text"
          placeholder="To search or delete project, key in project name"
          className="border p-2 rounded w-full"
          onChange={(e) => {
            e.preventDefault();
            setProjectName(e.target.value);
          }}
        />

        <div className="mt-4">
          {(projectName ? projects : projectsData) &&
          (projectName ? projects : projectsData).length == 0 ? (
            <p>No project found</p>
          ) : null}

          {(projectName ? projects : projectsData)?.map((project) => (
            <div
              key={project._id}
              className="flex justify-between items-center border p-2 rounded mb-2"
            >
              <div>
                <p className="text-sm">
                  <strong>Project Name:</strong> {project.projectName}
                </p>
                <p className="text-sm">
                  <strong>PIC:</strong> {project?.departmentHead?.email}
                </p>
                <p className="text-sm">
                  <strong>Skill 1:</strong> {project?.primarySkill?.name}
                </p>
                <p className="text-sm">
                  <strong>Skill 2:</strong>{" "}
                  {project?.secondarySkill?.name ?? "-"}
                </p>
                <p className="text-sm">
                  <strong>Skill 3:</strong> {project?.thirdSkill?.name ?? "-"}
                </p>
                <p className="text-sm">
                  <strong>Skill 4:</strong> {project?.fourthSkill?.name ?? "-"}
                </p>
                <p className="text-sm">
                  <strong>No Of Employee:</strong> {project?.employee}
                </p>
                <p className="text-sm">
                  <strong>Start Time:</strong> {project?.startTime}
                </p>
                <p className="text-sm">
                  <strong>End Time:</strong> {project?.endTime}
                </p>
              </div>
              {
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="text-red-500 text-xl"
                >
                  &times;
                </button>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;
