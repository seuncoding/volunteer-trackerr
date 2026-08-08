import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function VolunteerTracker() {
  const [volunteers, setVolunteers] = useState([]);
  const [view, setView] = useState('roster');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', roles: '', status: 'pending' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkinSearch, setCheckinSearch] = useState('');
  const [checkinResult, setCheckinResult] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Load volunteers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('volunteers');
    if (saved) {
      try {
        setVolunteers(JSON.parse(saved));
      } catch (err) {
        console.log('Error loading volunteers');
      }
    }
  }, []);

  // Save volunteers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  const handleAddEdit = () => {
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    let updated;
    if (editingId) {
      updated = volunteers.map(v => v.id === editingId ? { ...formData, id: editingId, checkins: v.checkins } : v);
    } else {
      updated = [...volunteers, { ...formData, id: Date.now(), checkins: [] }];
    }
    
    setVolunteers(updated);
    setFormData({ name: '', email: '', phone: '', roles: '', status: 'pending' });
    setEditingId(null);
    setView('roster');
  };

  const handleEdit = (volunteer) => {
    setFormData({ name: volunteer.name, email: volunteer.email, phone: volunteer.phone, roles: volunteer.roles, status: volunteer.status });
    setEditingId(volunteer.id);
    setView('add');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this volunteer?')) {
      setVolunteers(volunteers.filter(v => v.id !== id));
    }
  };

  const handleCheckIn = (volunteer) => {
    const now = new Date();
    const checkinTime = now.toLocaleString();
    const updatedVolunteers = volunteers.map(v => {
      if (v.id === volunteer.id) {
        return {
          ...v,
          checkins: [...(v.checkins || []), checkinTime],
          status: 'attended'
        };
      }
      return v;
    });
    setVolunteers(updatedVolunteers);
    setCheckinResult({ name: volunteer.name, time: checkinTime });
    setCheckinSearch('');
    setTimeout(() => setCheckinResult(null), 3000);
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const checkinVolunteer = volunteers.find(v => 
    v.name.toLowerCase().includes(checkinSearch.toLowerCase()) ||
    v.email.toLowerCase().includes(checkinSearch.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'attended': return { bg: '#eaf3de', text: '#3b6d11' };
      case 'confirmed': return { bg: '#e6f1fb', text: '#185fa5' };
      case 'no-show': return { bg: '#fcebeb', text: '#a32d2d' };
      default: return { bg: '#f1efe8', text: '#5f5e5a' };
    }
  };

  return (
    <>
      <Head>
        <title>Volunteer Tracker</title>
        <meta name="description" content="Track volunteers for your events" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Volunteer Tracker</h1>
          <p style={styles.subtitle}>Manage volunteers, track attendance, and run event check-ins</p>
        </div>

        <div style={styles.tabContainer}>
          <button
            onClick={() => setView('roster')}
            style={{
              ...styles.tab,
              ...{backgroundColor: view === 'roster' ? '#ffffff' : 'transparent', borderColor: view === 'roster' ? '#d3d1c7' : '#b4b2a9'}
            }}
          >
            👥 Roster
          </button>
          <button
            onClick={() => { setView('add'); setEditingId(null); setFormData({ name: '', email: '', phone: '', roles: '', status: 'pending' }); }}
            style={{
              ...styles.tab,
              ...{backgroundColor: view === 'add' ? '#ffffff' : 'transparent', borderColor: view === 'add' ? '#d3d1c7' : '#b4b2a9'}
            }}
          >
            ➕ Add volunteer
          </button>
          <button
            onClick={() => setView('checkin')}
            style={{
              ...styles.tab,
              ...{backgroundColor: view === 'checkin' ? '#ffffff' : 'transparent', borderColor: view === 'checkin' ? '#d3d1c7' : '#b4b2a9'}
            }}
          >
            ✓ Event check-in
          </button>
        </div>

        <div style={styles.content}>
          {view === 'roster' && (
            <div>
              <div style={styles.filterContainer}>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="no-show">No show</option>
                </select>
              </div>

              <div style={styles.volunteerGrid}>
                {filteredVolunteers.length === 0 ? (
                  <div style={styles.emptyState}>
                    <p>No volunteers found</p>
                  </div>
                ) : (
                  filteredVolunteers.map(v => {
                    const statusColor = getStatusColor(v.status);
                    return (
                      <div key={v.id} style={styles.volunteerCard}>
                        <div style={styles.cardHeader}>
                          <div>
                            <p style={styles.volunteerName}>{v.name}</p>
                            <p style={styles.contactInfo}>📧 {v.email}</p>
                            {v.phone && <p style={styles.contactInfo}>📱 {v.phone}</p>}
                          </div>
                          <span style={{...styles.statusBadge, backgroundColor: statusColor.bg, color: statusColor.text}}>
                            {v.status}
                          </span>
                        </div>
                        {v.roles && <p style={styles.roles}>💼 {v.roles}</p>}
                        {v.checkins && v.checkins.length > 0 && (
                          <p style={styles.lastCheckin}>⏰ Last check-in: {v.checkins[v.checkins.length - 1]}</p>
                        )}
                        <div style={styles.cardActions}>
                          <button onClick={() => handleEdit(v)} style={styles.editBtn}>Edit</button>
                          <button onClick={() => handleDelete(v.id)} style={styles.deleteBtn}>Delete</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {view === 'add' && (
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>{editingId ? 'Edit volunteer' : 'Add new volunteer'}</h2>
              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Full name"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="123-456-7890"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Roles</label>
                  <input
                    type="text"
                    value={formData.roles}
                    onChange={(e) => setFormData({...formData, roles: e.target.value})}
                    placeholder="e.g., Setup, Registration, Cleanup"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={styles.input}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="attended">Attended</option>
                    <option value="no-show">No show</option>
                  </select>
                </div>
              </div>
              <div style={styles.formButtons}>
                <button onClick={handleAddEdit} style={styles.submitBtn}>
                  {editingId ? 'Update volunteer' : 'Add volunteer'}
                </button>
                <button
                  onClick={() => { setView('roster'); setEditingId(null); setFormData({ name: '', email: '', phone: '', roles: '', status: 'pending' }); }}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {view === 'checkin' && (
            <div style={styles.checkinContainer}>
              <h2 style={styles.formTitle}>Event day check-in</h2>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={checkinSearch}
                onChange={(e) => setCheckinSearch(e.target.value)}
                style={styles.checkinInput}
                autoFocus
              />
              
              {checkinResult && (
                <div style={styles.successMessage}>
                  ✓ {checkinResult.name} checked in at {checkinResult.time}
                </div>
              )}

              {checkinSearch && !checkinVolunteer && (
                <div style={styles.notFoundMessage}>
                  No volunteer found matching "{checkinSearch}"
                </div>
              )}

              {checkinVolunteer && (
                <div style={styles.checkinCard}>
                  <p style={styles.checkinName}>{checkinVolunteer.name}</p>
                  <p style={styles.checkinEmail}>{checkinVolunteer.email}</p>
                  {checkinVolunteer.roles && (
                    <p style={styles.checkinRole}>Role: {checkinVolunteer.roles}</p>
                  )}
                  <button onClick={() => handleCheckIn(checkinVolunteer)} style={styles.checkinBtn}>
                    ✓ Check in now
                  </button>
                </div>
              )}

              {!checkinSearch && (
                <div style={styles.checkinPrompt}>
                  <p>Start typing a volunteer's name or email to check them in</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#888780',
    margin: 0,
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    borderBottom: '1px solid #d3d1c7',
    paddingBottom: '16px',
  },
  tab: {
    padding: '12px 24px',
    border: '1px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    border: '1px solid #d3d1c7',
  },
  filterContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 14px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #d3d1c7',
    backgroundColor: '#f9f9f8',
  },
  filterSelect: {
    padding: '10px 14px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #d3d1c7',
    backgroundColor: '#f9f9f8',
    cursor: 'pointer',
  },
  volunteerGrid: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#888780',
    gridColumn: '1 / -1',
  },
  volunteerCard: {
    backgroundColor: '#fafaf8',
    border: '1px solid #d3d1c7',
    borderRadius: '12px',
    padding: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  volunteerName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
  },
  contactInfo: {
    fontSize: '13px',
    color: '#888780',
    margin: '2px 0',
  },
  statusBadge: {
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    textTransform: 'capitalize',
  },
  roles: {
    fontSize: '13px',
    color: '#888780',
    margin: '8px 0 12px 0',
  },
  lastCheckin: {
    fontSize: '12px',
    color: '#b4b2a9',
    margin: '0 0 12px 0',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: 'transparent',
    border: '1px solid #d3d1c7',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: 'transparent',
    border: '1px solid #f0997b',
    color: '#993c1d',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  formContainer: {
    maxWidth: '600px',
    backgroundColor: '#fafaf8',
    border: '1px solid #d3d1c7',
    borderRadius: '12px',
    padding: '24px',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  form: {
    display: 'grid',
    gap: '16px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'grid',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #d3d1c7',
    backgroundColor: '#ffffff',
  },
  formButtons: {
    display: 'flex',
    gap: '12px',
  },
  submitBtn: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    backgroundColor: '#378add',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    border: '1px solid #d3d1c7',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  checkinContainer: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  checkinInput: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d3d1c7',
    backgroundColor: '#fafaf8',
    marginBottom: '20px',
  },
  successMessage: {
    backgroundColor: '#eaf3de',
    color: '#3b6d11',
    padding: '14px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontWeight: '500',
  },
  notFoundMessage: {
    color: '#888780',
    padding: '16px',
    fontSize: '14px',
    textAlign: 'center',
  },
  checkinCard: {
    backgroundColor: '#fafaf8',
    border: '1px solid #d3d1c7',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '20px',
  },
  checkinName: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  checkinEmail: {
    fontSize: '14px',
    color: '#888780',
    margin: '0 0 8px 0',
  },
  checkinRole: {
    fontSize: '14px',
    color: '#888780',
    margin: '0 0 16px 0',
  },
  checkinBtn: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    backgroundColor: '#639922',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  checkinPrompt: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#888780',
  },
};
