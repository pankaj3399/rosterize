import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listHeads } from "../api/Department";
import { listSkills } from "../api/Skill";

import { useAuth } from "../context/AuthContext";
import Loader from "../Components/Loader/Loader";
import {
  createProject,
  listProjects,
  searchProject,
  deleteProject,
} from "../api/Project";

const ProjectManagement = () => {
  const { authData } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const {
    data: skills,
    isLoading: loadingSkills,
    error: errorSkills,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: () => listSkills(),
    retry: 0,
  });

  const {
    data: projectsData,
    isLoading: loadingUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects(authData.company),
    enabled: !!authData.company,
    retry: 0,
  });

  const searchProjectMutation = useMutation({
    mutationFn: searchProject,
    onSuccess: (data) => {
      setProjects(data);
    },
    onError: (error) => {
      console.error("Search project failed:", error);
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries("projects");
      setMessage("Project added successfully");
      setError("");
    },
    onError: (error) => {
      setMessage("");
      setError(error.message);
      console.error("Add project failed:", error);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
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

  const [newProject, setNewProject] = useState({
    projectName: "",
    departmentHead: "",
    primarySkill: "",
    secondarySkill: "",
    thirdSkill: "",
    fourthSkill: "",
    employee: "",
    startTime: "",
    endTime: "",
  });

  const {
    data: heads,
    isLoading: loadingHeads,
    error: errorHeads,
  } = useQuery({
    queryKey: ["departmentHeads"],
    queryFn: () => listHeads(authData.company),
    enabled: !!authData.company,
    retry: 0,
  });

  const handleAddProject = () => {
    console.log(newProject);
    if (
      !newProject.projectName ||
      !newProject.departmentHead ||
      !newProject.primarySkill ||
      !newProject.employee ||
      !newProject.startTime ||
      !newProject.endTime
    ) {
      return alert("Fields are required");
    }

    if (parseInt(newProject.employee) <= 0) {
      return alert("Number of employees must be a positive number");
    }

    const startTime = new Date(newProject.startTime);
    const endTime = new Date(newProject.endTime);

    if (startTime >= endTime) {
      return alert("Start time must be earlier than end time");
    }

    createProjectMutation.mutate({ ...newProject, company: authData.company });

    setNewProject({
      projectName: "",
      departmentHead: "",
      primarySkill: "",
      secondarySkill: "",
      thirdSkill: "",
      fourthSkill: "",
      employee: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleDeleteProject = (projectId) => {
    deleteProjectMutation.mutate(projectId);
  };

  useEffect(() => {
    // debounce search
    const timeoutId = setTimeout(() => {
      searchProjectMutation.mutate({ projectName });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [projectName]);

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  if (loadingSkills || loadingHeads) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Project Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">
            Project Name:
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newProject.projectName}
            onChange={(e) =>
              setNewProject({ ...newProject, projectName: e.target.value })
            }
            required
          />

          <label className="block text-sm font-medium mb-1 mt-4">
            Skills Needed 1: (Compulsary)
          </label>
          <select
            className="border p-2 rounded w-full"
            required
            value={newProject.primarySkill}
            onChange={(e) =>
              setNewProject({ ...newProject, primarySkill: e.target.value })
            }
          >
            <option value="">Select Skill</option>
            {skills
              ?.filter(
                (skill) =>
                  skill._id !== newProject.secondarySkill &&
                  skill._id !== newProject.thirdSkill &&
                  skill._id !== newProject.fourthSkill
              )
              ?.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
          </select>

          <label className="block text-sm font-medium mb-1 mt-4">
            Skills Needed 3: (Can leave blank)
          </label>
          <select
            className="border p-2 rounded w-full"
            required
            value={newProject.thirdSkill}
            onChange={(e) =>
              setNewProject({ ...newProject, thirdSkill: e.target.value })
            }
          >
            <option value="">Select Skill</option>
            {skills
              ?.filter(
                (skill) =>
                  skill._id !== newProject.primarySkill &&
                  skill._id !== newProject.secondarySkill &&
                  skill._id !== newProject.fourthSkill
              )
              ?.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
          </select>

          <label className="block text-sm font-medium mb-1 mt-4">
            Start Time:
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newProject.startTime}
            onChange={(e) =>
              setNewProject({ ...newProject, startTime: e.target.value })
            }
            required
            type="datetime-local"
          />

          <label className="block text-sm font-medium mb-1 mt-4">
            No Of Employee Required: (Key in Number Only)
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newProject.employee}
            onChange={(e) =>
              setNewProject({ ...newProject, employee: e.target.value })
            }
            required
            type="number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Project/HOD In-charge: (Link to HOD):
          </label>
          <select
            className="border p-2 rounded w-full"
            required
            value={newProject.departmentHead}
            onChange={(e) =>
              setNewProject({ ...newProject, departmentHead: e.target.value })
            }
          >
            <option value="">Select HOD In-charge</option>
            {heads?.map((head) => (
              <option key={head._id} value={head._id}>
                {head.firstName} {head.lastName}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-1 mt-4">
            Skills Needed 2: (Can leave blank)
          </label>
          <select
            className="border p-2 rounded w-full"
            required
            value={newProject.secondarySkill}
            onChange={(e) =>
              setNewProject({ ...newProject, secondarySkill: e.target.value })
            }
          >
            <option value="">Select Skill</option>
            {skills
              ?.filter(
                (skill) =>
                  skill._id !== newProject.primarySkill &&
                  skill._id !== newProject.thirdSkill &&
                  skill._id !== newProject.fourthSkill
              )
              ?.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
          </select>

          <label className="block text-sm font-medium mb-1 mt-4">
            Skills Needed 4: (Can leave blank)
          </label>
          <select
            className="border p-2 rounded w-full"
            required
            value={newProject.fourthSkill}
            onChange={(e) =>
              setNewProject({ ...newProject, fourthSkill: e.target.value })
            }
          >
            <option value="">Select Skill</option>
            {skills
              ?.filter(
                (skill) =>
                  skill._id !== newProject.primarySkill &&
                  skill._id !== newProject.secondarySkill &&
                  skill._id !== newProject.thirdSkill
              )
              ?.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
          </select>

          <label className="block text-sm font-medium mb-1 mt-4">
            End Time:
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newProject.endTime}
            onChange={(e) =>
              setNewProject({ ...newProject, endTime: e.target.value })
            }
            required
            type="datetime-local"
          />
        </div>
      </div>

      <button
        onClick={handleAddProject}
        className="bg-blue-700 text-white p-2 rounded w-full lg:w-1/4"
        disabled={createProjectMutation.isPending}
      >
        {createProjectMutation.isPending ? "Adding Project..." : "Add Project"}
      </button>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Search Project</h3>
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

export default ProjectManagement;
