import type { Project, ProjectCategory, ProjectStatus } from './project';

export interface FilterState {
  searchQuery: string;
  selectedCategories: ProjectCategory[];
  selectedTags: string[];
  selectedStatus: ProjectStatus[];
}

export interface AppState {
  projects: Project[];
  filter: FilterState;
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
