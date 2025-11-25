// ============================================================================
// USE PROJECTS HOOK - Project data management
// ============================================================================

import { useState, useEffect } from 'react';
import { projectsAPI } from '../lib/api';
import type { Project, CreateProjectDTO } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await projectsAPI.getAll();
      // Transform dates from strings to Date objects
      const transformedData = data.map((project: any) => ({
        ...project,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }));
      setProjects(transformedData);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch projects';
      setError(message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single project by ID
  const fetchProjectById = async (id: string): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await projectsAPI.getById(id);
      // Transform dates
      return {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch project';
      setError(message);
      console.error('Error fetching project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects by client ID
  const fetchProjectsByClient = async (clientId: string): Promise<Project[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await projectsAPI.getByClient(clientId);
      // Transform dates
      return data.map((project: any) => ({
        ...project,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }));
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch projects by client';
      setError(message);
      console.error('Error fetching projects by client:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const createProject = async (data: CreateProjectDTO | any): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);

      // Ensure dates are in ISO string format
      const projectData = {
        ...data,
        startDate: data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate,
        endDate: data.endDate instanceof Date ? data.endDate.toISOString() : data.endDate,
      };

      const newProject = await projectsAPI.create(projectData);
      
      // Transform dates
      const transformedProject = {
        ...newProject,
        startDate: new Date(newProject.startDate),
        endDate: new Date(newProject.endDate),
        createdAt: new Date(newProject.createdAt),
        updatedAt: new Date(newProject.updatedAt),
      };
      
      setProjects(prev => [transformedProject, ...prev]);
      
      // Refresh projects list to ensure consistency
      await fetchProjects();
      
      return transformedProject;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create project';
      setError(message);
      console.error('Error creating project:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const updateProject = async (id: string, data: Partial<Project>): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure dates are in ISO string format if they exist
      const updateData: any = { ...data };
      if (updateData.startDate instanceof Date) {
        updateData.startDate = updateData.startDate.toISOString();
      }
      if (updateData.endDate instanceof Date) {
        updateData.endDate = updateData.endDate.toISOString();
      }
      
      const updatedProject = await projectsAPI.update(id, updateData);
      
      // Transform dates
      const transformedProject = {
        ...updatedProject,
        startDate: new Date(updatedProject.startDate),
        endDate: new Date(updatedProject.endDate),
        createdAt: new Date(updatedProject.createdAt),
        updatedAt: new Date(updatedProject.updatedAt),
      };
      
      setProjects(prev => 
        prev.map(project => project.id === id ? transformedProject : project)
      );
      
      return transformedProject;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update project';
      setError(message);
      console.error('Error updating project:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await projectsAPI.delete(id);
      
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete project';
      setError(message);
      console.error('Error deleting project:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    fetchProjectsByClient,
    createProject,
    updateProject,
    deleteProject,
  };
}
