import React, { useState } from 'react';
import { Plus, Save, Trash2, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

export function ProjectSidebar() {
  const { 
    projects, 
    currentProjectId, 
    saveProject, 
    loadProject, 
    createProject, 
    deleteProject 
  } = useStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = (e?: React.BaseSyntheticEvent) => {
    if (e) e.preventDefault();
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName('');
    }
  };

  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <div className={`project-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <span className="sidebar-title">PROJECTS</span>}
        <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-content">
          <form 
            onSubmit={handleCreate} 
            className="new-project-form"
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(e); }}
          >
            <input 
              type="text" 
              placeholder="NEW PROJECT NAME..." 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="console-input"
              autoComplete="off"
            />
            <button 
              type="button" 
              className="icon-btn" 
              title="Create Project"
              onClick={() => handleCreate()}
            >
              <Plus size={18} />
            </button>
          </form>

          <div className="project-list">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className={`project-item ${currentProjectId === project.id ? 'active' : ''}`}
              >
                <div className="project-info">
                  <span className="project-name">{project.name}</span>
                  <span className="project-date">
                    {new Date(project.lastSaved).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="project-actions">
                  {currentProjectId === project.id ? (
                    <button className="action-btn save" onClick={saveProject} title="Save Current">
                      <Save size={14} /> SAVE
                    </button>
                  ) : (
                    <button className="action-btn load" onClick={() => loadProject(project.id)} title="Load">
                      <FolderOpen size={14} /> LOAD
                    </button>
                  )}
                  <button className="action-btn delete" onClick={() => deleteProject(project.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {currentProject && (
            <div className="status-footer">
              <div className="status-indicator active"></div>
              <div className="status-text">
                <span className="source-label">SOVERIS</span>
                <span className="status-val">ACTIVE: {currentProject?.name || '---'}</span>
              </div>
            </div>
          )}
          <div className="branding-footer">
            POWERED BY SOVERIS (FORMERLY PHUNK)
          </div>
        </div>
      )}
    </div>
  );
}
