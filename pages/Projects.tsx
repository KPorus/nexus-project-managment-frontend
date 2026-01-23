import React, { useEffect, useState } from "react";
import { ProjectStatus, Role, type Project } from "../types";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ApiService } from "../services/apiService";
import type { RootState } from "../store/store";
import {
  fetchAllprojects,
  softDelete,
} from "../store/slices/helper/dataThunks";

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { projects, loading } = useAppSelector(
    (state: RootState) => state.data
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "ALL">(
    "ALL"
  );
  console.log(projects);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.ACTIVE);

  useEffect(() => {
    dispatch(fetchAllprojects());
  }, [dispatch]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setStatus(ProjectStatus.ACTIVE);
    setEditingProject(null);
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setName(project.name);
      setDescription(project.description);
      setStatus(project.status);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await ApiService.project.edit(
          name,
          description,
          status,
          editingProject.id
        );
      } else {
        await ApiService.project.create(name, description);
      }
      handleCloseModal();
      dispatch(fetchAllprojects());
    } catch (error) {
      console.error(error);
    }
  };

  const canEdit = user?.role === Role.ADMIN;

  const filteredProjects = projects.filter((project) => {
    if (filterStatus === "ALL") return true;
    return project.status === filterStatus;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await dispatch(softDelete(id));
    }
  };

  const getStatusStyle = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case ProjectStatus.ARCHIVED:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case ProjectStatus.DELETED:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Projects
        </h2>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as ProjectStatus | "ALL")
              }
              className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
            >
              <option value="ALL">All Status</option>
              <option value={ProjectStatus.ACTIVE}>Active</option>
              <option value={ProjectStatus.ARCHIVED}>Archived</option>
              <option value={ProjectStatus.DELETED}>Deleted</option>
            </select>
          </div>
          <Button onClick={() => handleOpenModal()}>+ New Project</Button>
        </div>
      </div>

      {loading ? (
        <div>Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project: Project) => {
              const isDeleted =
                project.status === ProjectStatus.DELETED || project.isDeleted;
              return (
                <div
                  key={project.id || (project as any)._id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col transition-all hover:shadow-md ${
                    isDeleted
                      ? "opacity-70 dark:bg-gray-800/60 grayscale-[0.5]"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-2">
                      {project.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusStyle(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3 text-sm">
                    {project.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                    Created by:{" "}
                    {project.createdBy === user?.id ? "You" : "Another User"}
                  </div>

                  {canEdit && !project.isDeleted && (
                    <div className="flex space-x-2 mt-auto pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(project)}
                        className="flex-1"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)} // Clean ID
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No projects found matching the selected filter.
              </p>
              {filterStatus !== "ALL" && (
                <button
                  onClick={() => setFilterStatus("ALL")}
                  className="mt-2 text-primary hover:text-indigo-600 font-medium text-sm"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? "Edit Project" : "Create Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>
          {editingProject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.values(ProjectStatus)
                  .filter((s) => s !== ProjectStatus.DELETED)
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              className="mr-3"
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
