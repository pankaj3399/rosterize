import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkill, listSkills, removeSkill } from "../api/Skill";
import { useAuth } from "../context/AuthContext";
import Loader from "../Components/Loader/Loader";

const SkillsManagement = () => {
  const [newSkill, setNewSkill] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { authData } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["skills"],
    queryFn: () => listSkills(),
    enabled: !!authData.company,
    retry: 0,
  });

  const addSkillMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: (data) => {
      queryClient.invalidateQueries("skills");
    },
    onError: (error) => {
      console.error("Add skill failed:", error);
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: removeSkill,
    onSuccess: (data) => {
      queryClient.invalidateQueries("skills");
    },
    onError: (error) => {
      console.error("Delete skill failed:", error);
      skill;
    },
  });

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      const skillExists = data?.some(
        (skill) => skill.name.toLowerCase() === newSkill.toLowerCase()
      );
      if (skillExists) {
        setErrorMessage("Skill already exists!");
      } else {
        addSkillMutation.mutate({ name: newSkill });
        setErrorMessage("");
        setNewSkill("");
      }
    }
  };

  const deleteSkill = (skillId) => {
    deleteSkillMutation.mutate(skillId);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Skill Management</h2>
      <div className="mb-4">
        <label className="block font-bold mb-2">List of Skills:</label>
        <ul className="border rounded-md p-2 max-h-40 overflow-y-auto">
          {data?.map((skill, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              {skill.name}
              <button
                onClick={() => deleteSkill(skill._id)}
                className="text-red-500 hover:text-red-700 font-bold text-sm"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Add New Skill:</label>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={addSkill}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-2"
        >
          Save Changes
        </button>
        <button
          onClick={() => setNewSkill("")}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-md"
        >
          Cancel
        </button>
      </div>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default SkillsManagement;
