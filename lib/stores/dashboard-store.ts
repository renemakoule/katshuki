// lib/stores/dashboard-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Template, mockTemplates, templateCategories, templateSectors, templateStyles } from '@/lib/mock-data/templates';
import { BrandKit, mockBrandKits } from '@/lib/mock-data/brand-kit';

interface CollaborationData {
  projects: {
    id: string
    name: string
    description: string
    status: 'active' | 'review' | 'completed'
    progress: number
    lastActivity: string
    members: { name: string; avatar: string; role: string }[]
  }[]
  recentActivity: {
    user: { name: string; avatar: string }
    action: string
    timestamp: string
  }[]
  teamMembers: {
    name: string
    role: string
    avatar: string
    status: 'online' | 'offline'
  }[]
  comments: { [projectId: string]: { user: string; message: string; timestamp: string }[] }
}

interface DashboardState {
  // Templates
  templates: Template[];
  filteredTemplates: Template[];
  selectedTemplate: Template | null;
  templateFilters: {
    category: string;
    sector: string;
    style: string;
    search: string;
    isPremium: boolean | null;
  };
  
  // Brand Kit
  brandKits: BrandKit[];
  activeBrandKit: BrandKit | null;
  
  // UI State
  activeSection: string;
  sidebarOpen: boolean;
  viewMode: 'grid' | 'list';
  
  // Analytics Mock
  analytics: {
    totalProjects: number;
    completedProjects: number;
    favoriteTemplates: string[];
    recentActivity: Array<{
      id: string;
      type: string;
      timestamp: string;
      description: string;
    }>;
  };
  
  // Collaboration Mock
  collaborationData: {
    projects: Array<{
      id: string;
      name: string;
      description: string;
      status: 'active' | 'review' | 'completed';
      progress: number;
      lastActivity: string;
      members: Array<{ name: string; avatar: string; role: string }>;
    }>;
    recentActivity: Array<{
      user: { name: string; avatar: string };
      action: string;
      timestamp: string;
    }>;
    teamMembers: Array<{
      name: string;
      role: string;
      avatar: string;
      status: 'online' | 'offline';
    }>;
    comments: { [projectId: string]: Array<{ user: string; message: string; timestamp: string }> };
  };
}

interface DashboardActions {
  // Template Actions
  setTemplateFilters: (filters: Partial<DashboardState['templateFilters']>) => void;
  selectTemplate: (template: Template | null) => void;
  toggleTemplateFavorite: (templateId: string) => void;
  searchTemplates: (query: string) => void;
  
  // Brand Kit Actions
  setActiveBrandKit: (brandKit: BrandKit | null) => void;
  updateBrandKit: (brandKit: Partial<BrandKit>) => void;
  
  // UI Actions
  setActiveSection: (section: string) => void;
  toggleSidebar: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Analytics Actions
  incrementProjectCount: () => void;
  addRecentActivity: (activity: DashboardState['analytics']['recentActivity'][0]) => void;
  
  // Collaboration Actions
  addComment: (projectId: string, comment: Omit<DashboardState['collaborationData']['comments'][string][number], 'id' | 'timestamp'>) => void;
  updateUserStatus: (userId: string, status: 'online' | 'away' | 'offline') => void;
}

const filterTemplates = (templates: Template[], filters: DashboardState['templateFilters']) => {
  return templates.filter(template => {
    const matchesCategory = filters.category === 'all' || template.category === filters.category;
    const matchesSector = filters.sector === 'all' || template.sector === filters.sector;
    const matchesStyle = filters.style === 'all' || template.style === filters.style;
    const matchesSearch = !filters.search || 
      template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      template.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesPremium = filters.isPremium === null || template.isPremium === filters.isPremium;
    
    return matchesCategory && matchesSector && matchesStyle && matchesSearch && matchesPremium;
  });
};

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  persist(
    (set, get) => ({
      // Initial State
      templates: mockTemplates,
      filteredTemplates: mockTemplates,
      selectedTemplate: null,
      templateFilters: {
        category: 'all',
        sector: 'all',
        style: 'all',
        search: '',
        isPremium: null
      },
      
      brandKits: mockBrandKits,
      activeBrandKit: mockBrandKits[0], // Default to first brand kit
      
      activeSection: 'copilot',
      sidebarOpen: true,
      viewMode: 'grid',
      
      analytics: {
        totalProjects: 24,
        completedProjects: 18,
        favoriteTemplates: ['social-post-1', 'newsletter-1', 'invitation-1'],
        recentActivity: [
          {
            id: '1',
            type: 'template_used',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            description: 'Utilisé le template "Post Instagram Moderne"'
          },
          {
            id: '2',
            type: 'project_completed',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            description: 'Projet "Campagne été 2024" terminé'
          },
          {
            id: '3',
            type: 'brand_kit_updated',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            description: 'Brand Kit "Tech Startup" mis à jour'
          }
        ]
      },
      
      collaboration: {
        activeUsers: [
          {
            id: 'user-1',
            name: 'Marie Dubois',
            avatar: '/avatars/marie.jpg',
            status: 'online'
          },
          {
            id: 'user-2',
            name: 'Jean Martin',
            avatar: '/avatars/jean.jpg',
            status: 'away'
          }
        ],
        comments: [
          {
            id: 'comment-1',
            userId: 'user-1',
            content: 'J\'aime beaucoup cette direction créative !',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            position: { x: 100, y: 200 }
          }
        ]
      },

      // Ajout de la propriété collaborationData pour correspondre à DashboardState
      collaborationData: {
        projects: [],
        recentActivity: [],
        teamMembers: [],
        comments: {}
      },
      
      // Actions
      setTemplateFilters: (filters) => {
        const currentFilters = get().templateFilters;
        const newFilters = { ...currentFilters, ...filters };
        const filteredTemplates = filterTemplates(get().templates, newFilters);
        
        set({
          templateFilters: newFilters,
          filteredTemplates
        });
      },
      
      selectTemplate: (template) => {
        set({ selectedTemplate: template });
        
        if (template) {
          get().addRecentActivity({
            id: Date.now().toString(),
            type: 'template_selected',
            timestamp: new Date().toISOString(),
            description: `Template "${template.name}" sélectionné`
          });
        }
      },
      
      toggleTemplateFavorite: (templateId) => {
        const currentFavorites = get().analytics.favoriteTemplates;
        const newFavorites = currentFavorites.includes(templateId)
          ? currentFavorites.filter(id => id !== templateId)
          : [...currentFavorites, templateId];
        
        set(state => ({
          analytics: {
            ...state.analytics,
            favoriteTemplates: newFavorites
          }
        }));
      },
      
      searchTemplates: (query) => {
        get().setTemplateFilters({ search: query });
      },
      
      setActiveBrandKit: (brandKit) => {
        set({ activeBrandKit: brandKit });
        
        if (brandKit) {
          get().addRecentActivity({
            id: Date.now().toString(),
            type: 'brand_kit_selected',
            timestamp: new Date().toISOString(),
            description: `Brand Kit "${brandKit.name}" activé`
          });
        }
      },
      
      updateBrandKit: (updates) => {
        const currentBrandKit = get().activeBrandKit;
        if (!currentBrandKit) return;
        
        const updatedBrandKit = { ...currentBrandKit, ...updates };
        const updatedBrandKits = get().brandKits.map(kit => 
          kit.id === currentBrandKit.id ? updatedBrandKit : kit
        );
        
        set({
          activeBrandKit: updatedBrandKit,
          brandKits: updatedBrandKits
        });
        
        get().addRecentActivity({
          id: Date.now().toString(),
          type: 'brand_kit_updated',
          timestamp: new Date().toISOString(),
          description: `Brand Kit "${updatedBrandKit.name}" mis à jour`
        });
      },
      
      setActiveSection: (section) => {
        set({ activeSection: section });
      },
      
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },
      
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },
      
      incrementProjectCount: () => {
        set(state => ({
          analytics: {
            ...state.analytics,
            totalProjects: state.analytics.totalProjects + 1,
            completedProjects: state.analytics.completedProjects + 1
          }
        }));
      },
      
      addRecentActivity: (activity) => {
        set(state => ({
          analytics: {
            ...state.analytics,
            recentActivity: [
              { ...activity, id: activity.id || Date.now().toString(), timestamp: activity.timestamp || new Date().toISOString() },
              ...state.analytics.recentActivity.slice(0, 9) // Keep only 10 most recent
            ]
          }
        }));
      },
      
      addComment: (projectId: string, comment: Omit<DashboardState['collaborationData']['comments'][string][number], 'id' | 'timestamp'>) => {
        const newComment = {
          ...comment,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        };
        
        set(state => ({
          collaborationData: {
            ...state.collaborationData,
            comments: {
              ...state.collaborationData.comments,
              [projectId]: [
                ...(state.collaborationData.comments[projectId] || []),
                newComment
              ]
            }
          }
        }));
      },
      
      updateUserStatus: (userId, status) => {
        // Map 'away' status to 'offline' to match the state type
        const validStatus = status === 'away' ? 'offline' : status;
        
        set(state => ({
          collaborationData: {
            ...state.collaborationData,
            teamMembers: state.collaborationData.teamMembers.map(member =>
              member.name === userId ? { ...member, status: validStatus } : member
            )
          }
        }));
      }
    }),
    {
      name: 'dashboard-store',
      partialize: (state) => ({
        templateFilters: state.templateFilters,
        activeBrandKit: state.activeBrandKit,
        activeSection: state.activeSection,
        sidebarOpen: state.sidebarOpen,
        viewMode: state.viewMode,
        analytics: state.analytics
      })
    }
  )
);
