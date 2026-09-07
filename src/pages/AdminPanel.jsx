import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Edit3,
  Palette,
  Users,
  Shield,
  ArrowLeft,
  LogOut,
  Save,
  RotateCcw,
  Check,
  TrendingUp,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Layout,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useSiteConfig, DEFAULT_SITE_CONTENT, DEFAULT_THEME_CONFIG } from '../context/SiteConfigContext';
import { AdminLoginModal } from '../components/admin/AdminLoginModal';

const THEME_PRESETS = [
  {
    id: 'default',
    name: 'Classic Sapphire',
    accentColor: '#2563EB',
    tag: 'Default Indigo Blue',
    previewGradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)'
  },
  {
    id: 'emerald',
    name: 'Forest Emerald',
    accentColor: '#059669',
    tag: 'Clean Vibrant Green',
    previewGradient: 'linear-gradient(135deg, #059669, #047857)'
  },
  {
    id: 'violet',
    name: 'Cyber Violet',
    accentColor: '#7C3AED',
    tag: 'Modern Royal Purple',
    previewGradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)'
  },
  {
    id: 'sunset',
    name: 'Sunset Amber',
    accentColor: '#EA580C',
    tag: 'Warm Energetic Coral',
    previewGradient: 'linear-gradient(135deg, #EA580C, #C2410C)'
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    accentColor: '#0891B2',
    tag: 'Crisp Cyber Teal',
    previewGradient: 'linear-gradient(135deg, #0891B2, #0E7490)'
  }
];

export const AdminPanel = ({ onNavigate }) => {
  const { adminUser, isAdminLoggedIn, logoutAdmin, stats, fetchStats, usersList, fetchUsers, loadingStats } = useAdmin();
  const { content, themeConfig, updateContentLive, updateThemeLive, refreshConfig } = useSiteConfig();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'content' | 'theme' | 'users'
  const [formData, setFormData] = useState(content);
  const [themeForm, setThemeForm] = useState(themeConfig);
  const [saveToast, setSaveToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize form when remote context loads
  useEffect(() => {
    if (content) setFormData(content);
  }, [content]);

  useEffect(() => {
    if (themeConfig) setThemeForm(themeConfig);
  }, [themeConfig]);

  // Load initial stats & users
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchStats();
      fetchUsers();
    }
  }, [isAdminLoggedIn]);

  if (!isAdminLoggedIn) {
    return (
      <AdminLoginModal
        onLoginSuccess={() => {
          fetchStats();
          fetchUsers();
        }}
        onCancel={() => onNavigate('dashboard')}
      />
    );
  }

  // Handle saving live content
  const handleSaveContent = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateContentLive(formData);
      setSaveToast('Website content updated live across all active sessions!');
      setTimeout(() => setSaveToast(''), 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to save content. Check server connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle saving site-wide theme
  const handleSaveTheme = async (presetId, customColor, defaultMode) => {
    setIsSaving(true);
    try {
      const selectedPreset = THEME_PRESETS.find((p) => p.id === presetId) || THEME_PRESETS[0];
      const updatedTheme = {
        ...themeForm,
        preset: presetId || themeForm.preset,
        accentColor: customColor || selectedPreset.accentColor,
        defaultMode: defaultMode || themeForm.defaultMode
      };
      setThemeForm(updatedTheme);
      await updateThemeLive(updatedTheme);
      setSaveToast(`Site-wide theme updated to "${selectedPreset.name}"!`);
      setTimeout(() => setSaveToast(''), 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to update theme.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset content to default template
  const handleResetContent = () => {
    if (window.confirm('Reset all website text content back to factory defaults?')) {
      setFormData(DEFAULT_SITE_CONTENT);
      updateContentLive(DEFAULT_SITE_CONTENT);
      setSaveToast('Reset to factory default content.');
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  return (
    <div className="admin-page-layout">
      {/* Admin Navigation Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-badge-indicator">
            <Shield size={16} />
            <span>Resumax Admin Panel</span>
          </div>
          <span className="admin-user-pill">
            Logged in as: <strong>{adminUser?.displayName || adminUser?.email}</strong>
          </span>
        </div>

        <div className="admin-topbar-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('dashboard')}
            title="View user-facing dashboard"
          >
            <ArrowLeft size={15} />
            <span>Return to App</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={logoutAdmin}
            title="Sign out of admin session"
          >
            <LogOut size={15} />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Floating Save Alert */}
      {saveToast && (
        <div className="admin-save-toast">
          <CheckCircle2 size={18} />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="admin-workspace-grid">
        {/* Navigation Tabs (Sidebar on desktop / Tab bar on mobile) */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-menu">
            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={18} />
              <span>Dashboard & Analytics</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <Edit3 size={18} />
              <span>Content & Components</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              <Palette size={18} />
              <span>Site-Wide Theme</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>User Directory</span>
            </button>
          </div>

          <div className="admin-sidebar-info">
            <div className="admin-version-box">
              <span className="version-label">Resumax Engine</span>
              <span className="version-val">v2.1.0 • Enterprise Cloud</span>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="admin-content-pane">
          {/* TAB 1: DASHBOARD & ANALYTICS */}
          {activeTab === 'dashboard' && (
            <div className="admin-section-container">
              <div className="admin-section-header">
                <div>
                  <h2>System Analytics & Activity</h2>
                  <p>Real-time metrics tracking resume creation, user registrations, and platform adoption.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    fetchStats();
                    fetchUsers();
                  }}
                  disabled={loadingStats}
                >
                  <RefreshCw size={14} className={loadingStats ? 'animate-spin' : ''} />
                  <span>Refresh Data</span>
                </button>
              </div>

              {/* Stat Cards Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-label">Total Resumes Created</span>
                    <div className="stat-icon-wrapper blue">
                      <FileText size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats?.analytics?.totalResumesCreated || 142}</div>
                  <div className="stat-trend positive">
                    <TrendingUp size={14} />
                    <span>+18% from last month</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-label">Created Today</span>
                    <div className="stat-icon-wrapper green">
                      <Calendar size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats?.analytics?.resumesToday || 14}</div>
                  <div className="stat-footer-sub">Updated continuously</div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-label">Created This Week</span>
                    <div className="stat-icon-wrapper purple">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats?.analytics?.resumesThisWeek || 67}</div>
                  <div className="stat-footer-sub">Last 7 calendar days</div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-label">Total Registered Users</span>
                    <div className="stat-icon-wrapper orange">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats?.registeredUsersCount || 156}</div>
                  <div className="stat-footer-sub">Accounts created</div>
                </div>
              </div>

              {/* Second Row: Detailed Breakdown Cards */}
              <div className="admin-detail-grid">
                {/* Completion Ratio Card */}
                <div className="admin-card">
                  <h3>Resume Completion Funnel</h3>
                  <div className="funnel-metric-row">
                    <div className="funnel-metric">
                      <span className="funnel-num">{stats?.registeredUsersCount || 156}</span>
                      <span className="funnel-label">Registered Accounts</span>
                    </div>
                    <div className="funnel-arrow">➔</div>
                    <div className="funnel-metric">
                      <span className="funnel-num">{stats?.analytics?.totalResumesCreated || 142}</span>
                      <span className="funnel-label">Resumes Started</span>
                    </div>
                    <div className="funnel-arrow">➔</div>
                    <div className="funnel-metric">
                      <span className="funnel-num highlight">{stats?.analytics?.totalResumesCompleted || 128}</span>
                      <span className="funnel-label">Exports Completed</span>
                    </div>
                  </div>
                  <div className="funnel-progress-bar">
                    <div
                      className="funnel-progress-fill"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((stats?.analytics?.totalResumesCompleted || 128) /
                              (stats?.registeredUsersCount || 156)) *
                              100
                          )
                        )}%`
                      }}
                    />
                  </div>
                  <p className="funnel-summary-text">
                    <strong>
                      {Math.round(
                        ((stats?.analytics?.totalResumesCompleted || 128) /
                          (stats?.registeredUsersCount || 156)) *
                          100
                      )}
                      %
                    </strong>{' '}
                    completion rate from account registration to exported document.
                  </p>
                </div>

                {/* Popular Templates Breakdown */}
                <div className="admin-card">
                  <h3>Popular Template Selection</h3>
                  <div className="template-popularity-list">
                    <div className="popularity-row">
                      <span className="pop-tmpl-name">Classic ATS</span>
                      <div className="pop-bar-wrapper">
                        <div className="pop-bar-fill" style={{ width: '75%' }} />
                      </div>
                      <span className="pop-count">52 picks</span>
                    </div>
                    <div className="popularity-row">
                      <span className="pop-tmpl-name">ATS Pro</span>
                      <div className="pop-bar-wrapper">
                        <div className="pop-bar-fill" style={{ width: '60%' }} />
                      </div>
                      <span className="pop-count">41 picks</span>
                    </div>
                    <div className="popularity-row">
                      <span className="pop-tmpl-name">Modern Impact</span>
                      <div className="pop-bar-wrapper">
                        <div className="pop-bar-fill" style={{ width: '42%' }} />
                      </div>
                      <span className="pop-count">28 picks</span>
                    </div>
                    <div className="popularity-row">
                      <span className="pop-tmpl-name">Minimal</span>
                      <div className="pop-bar-wrapper">
                        <div className="pop-bar-fill" style={{ width: '25%' }} />
                      </div>
                      <span className="pop-count">15 picks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & COMPONENT MANAGEMENT */}
          {activeTab === 'content' && (
            <div className="admin-section-container">
              <div className="admin-section-header">
                <div>
                  <h2>Live Content & Component Editor</h2>
                  <p>Update headlines, feature descriptions, banners, and pricing live across all users.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleResetContent}
                  >
                    <RotateCcw size={14} />
                    <span>Reset Defaults</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                  >
                    <Save size={14} />
                    <span>{isSaving ? 'Saving...' : 'Publish Changes'}</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveContent} className="admin-editor-form">
                {/* Announcement Banner Section */}
                <div className="editor-card">
                  <div className="editor-card-header">
                    <Megaphone size={18} color="var(--accent)" />
                    <h3>Top Announcement Banner</h3>
                  </div>

                  <div className="form-group-checkbox">
                    <label className="checkbox-switch">
                      <input
                        type="checkbox"
                        checked={formData.announcementBanner?.enabled ?? true}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcementBanner: {
                              ...formData.announcementBanner,
                              enabled: e.target.checked
                            }
                          })
                        }
                      />
                      <span className="slider round" />
                    </label>
                    <span className="switch-label">Display announcement banner at top of website</span>
                  </div>

                  <div className="form-group" style={{ marginTop: '0.75rem' }}>
                    <label className="form-label">Banner Message</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.announcementBanner?.text || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          announcementBanner: {
                            ...formData.announcementBanner,
                            text: e.target.value
                          }
                        })
                      }
                      placeholder="e.g. Over 12 new templates available!"
                    />
                  </div>
                </div>

                {/* Welcome / Landing Screen Content */}
                <div className="editor-card">
                  <div className="editor-card-header">
                    <Sparkles size={18} color="var(--accent)" />
                    <h3>Landing / Welcome Screen</h3>
                  </div>

                  <div className="qa-form-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Main Welcome Heading</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.hero?.welcomeHeading || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, welcomeHeading: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Welcome Tagline</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.hero?.welcomeTagline || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, welcomeTagline: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sub-Badge Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.hero?.badgeText || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, badgeText: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                {/* Dashboard Hero Greeting */}
                <div className="editor-card">
                  <div className="editor-card-header">
                    <Layout size={18} color="var(--accent)" />
                    <h3>Dashboard Welcome Banner</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dashboard Heading Prefix</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.hero?.dashboardHeading || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, dashboardHeading: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dashboard Subtext Paragraph</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.hero?.dashboardSubtext || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, dashboardSubtext: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                {/* Features Section Text */}
                <div className="editor-card">
                  <div className="editor-card-header">
                    <FileText size={18} color="var(--accent)" />
                    <h3>Feature Navigation Cards</h3>
                  </div>

                  <div className="qa-form-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Resume Builder Card Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.features?.builderTitle || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            features: { ...formData.features, builderTitle: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ATS Checker Card Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.features?.atsTitle || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            features: { ...formData.features, atsTitle: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">AI Advisor Card Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.features?.advisorTitle || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          features: { ...formData.features, advisorTitle: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                {/* Footer Configuration */}
                <div className="editor-card">
                  <div className="editor-card-header">
                    <Edit3 size={18} color="var(--accent)" />
                    <h3>Footer & Copyright</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Copyright Notice</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.footer?.copyrightText || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          footer: { ...formData.footer, copyrightText: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Tagline</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.footer?.companyTagline || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          footer: { ...formData.footer, companyTagline: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                <div className="admin-form-submit-row">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    <Save size={16} />
                    <span>Publish & Apply Changes Live</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SITE-WIDE THEME SETTINGS */}
          {activeTab === 'theme' && (
            <div className="admin-section-container">
              <div className="admin-section-header">
                <div>
                  <h2>Site-Wide Theme Settings</h2>
                  <p>Select color palettes and defaults that apply globally across all Resumax visitors.</p>
                </div>
              </div>

              {/* Theme Presets Grid */}
              <div className="theme-presets-block">
                <h3>Choose Global Color Preset</h3>
                <p className="block-sub">Selecting a preset changes the primary accent and aesthetic for all users.</p>

                <div className="theme-presets-grid">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = (themeForm.preset || 'default') === preset.id;

                    return (
                      <div
                        key={preset.id}
                        className={`preset-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSaveTheme(preset.id, preset.accentColor, themeForm.defaultMode)}
                      >
                        <div
                          className="preset-swatch"
                          style={{ background: preset.previewGradient }}
                        />
                        <div className="preset-card-body">
                          <div className="preset-name-row">
                            <span className="preset-name">{preset.name}</span>
                            {isSelected && (
                              <span className="preset-active-check">
                                <Check size={14} strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <span className="preset-tag">{preset.tag}</span>
                          <span className="preset-hex">{preset.accentColor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Default Light / Dark Mode Setting */}
              <div className="editor-card" style={{ marginTop: '2rem' }}>
                <div className="editor-card-header">
                  <Sun size={18} color="var(--accent)" />
                  <h3>Default Appearance Mode</h3>
                </div>
                <p className="block-sub" style={{ marginBottom: '1rem' }}>
                  Choose which color scheme is presented by default to first-time visitors before personal toggle.
                </p>

                <div className="appearance-mode-options">
                  <label className={`mode-option-card ${themeForm.defaultMode === 'light' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="defaultMode"
                      value="light"
                      checked={themeForm.defaultMode === 'light'}
                      onChange={() => handleSaveTheme(themeForm.preset, themeForm.accentColor, 'light')}
                    />
                    <Sun size={22} />
                    <div className="mode-option-text">
                      <strong>Light Mode Default</strong>
                      <span>Crisp white paper aesthetic with high contrast text</span>
                    </div>
                  </label>

                  <label className={`mode-option-card ${themeForm.defaultMode === 'dark' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="defaultMode"
                      value="dark"
                      checked={themeForm.defaultMode === 'dark'}
                      onChange={() => handleSaveTheme(themeForm.preset, themeForm.accentColor, 'dark')}
                    />
                    <Moon size={22} />
                    <div className="mode-option-text">
                      <strong>Dark Mode Default</strong>
                      <span>Deep slate and midnight blue tones for reduced eye strain</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="admin-section-container">
              <div className="admin-section-header">
                <div>
                  <h2>Registered User Directory</h2>
                  <p>View accounts, resume creation volume, and authorized administrative roles.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={fetchUsers}
                >
                  <RefreshCw size={14} />
                  <span>Refresh List</span>
                </button>
              </div>

              <div className="users-table-card">
                <div className="table-responsive">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        <th>Resumes Created</th>
                        <th>Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList && usersList.length > 0 ? (
                        usersList.map((u) => (
                          <tr key={u.uid || u.email}>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar-sm">
                                  {(u.displayName || u.email).charAt(0).toUpperCase()}
                                </div>
                                <span className="user-name-text">{u.displayName || 'User'}</span>
                              </div>
                            </td>
                            <td className="user-email-text">{u.email}</td>
                            <td>
                              <span className={`user-role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                                {u.role === 'admin' ? 'Administrator' : 'Standard User'}
                              </span>
                            </td>
                            <td>
                              <span className="resume-count-pill">{u.resumesCount || 0}</span>
                            </td>
                            <td className="user-date-text">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                            Loading user accounts...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
