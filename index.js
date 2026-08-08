'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [volunteers, setVolunteers] = useState([]);
  const [view, setView] = useState('roster');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', roles: '', status: 'pending' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkinSearch, setCheckinSearch] = useState('');
  const [checkinResult, setCheckinResult] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('volunteers');
    if (saved) {
      try {
        setVolunteers(JSON.parse(saved));
      } catch (err) {
        console.log('Error loading volunteers');
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('volunteers', JSON.stringify(volunteers));
    }
  }, [volunteers, isClient]);

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
        return { ...v, checkins: [...(v.checkins || []), checkinTime], status: 'attended' };
      }
      return v;
    });
    setVolunteers(updatedVolunteers);
    setCheckinResult({ name: volunteer.name, time: checkinTime });
    setCheckinSearch('');
    setTimeout(() => setCheckinResult(null), 3000);
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const checkinVolunteer = volunteers.find(v => 
    v.name.toLowerCase().includes(checkinSearch.toLowerCase()) || v.email.toLowerCase().includes(checkinSearch.toLowerCase())
  );

  if (!isClient) return null;

  return (
    <>
      <Head>
        <title>Volunteer Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f3; color: #2c2c2a; }
      `}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: '100vh' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>Volunteer Tracker</h1>
          <p style={{ fontSize: '16px', color: '#888780', margin: 0 }}>Manage volunteers & event check-ins</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '1px solid #d3d1c7', paddingBottom: '16px' }}>
          <button onClick={() => setView('roster')} style={{ padding: '12px 24px', border: '1px solid #d3d1c7', borderRadius: '8px', backgroundColor: view === 'roster' ? '#fff' : 'transparent' }}>👥 Roster</button>
          <button onClick={() => { setView('add'); setEditingId(null); setFormData({ name: '', email: '', phone: '', roles: '', status: 'pending' }); }} style={{ padding: '12px 24px', border: '1px solid #d3d1c7', borderRadius: '8px', backgroundColor: view === 'add' ? '#fff' : 'transparent' }}>➕ Add</button>
          <button onClick={() => setView('checkin')} style={{ padding: '12px 24px', border: '1px solid #d3d1c7', borderRadius: '8px', backgroundColor: view === 'checkin' ? '#fff' : 'transparent' }}>✓ Check-in</button>
        </div>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', border: '1px solid #d3d1c7', minHeight: '400px' }}>
          {/* Roster view */}
          {view === 'roster' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #d3d1c7' }} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d3d1c7' }}>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="no-show">No show</option>
                </select>
              </div>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {filteredVolunteers.length === 0 ? (
                  <p style={{ color: '#888780' }}>No volunteers yet</p>
                ) : (
                  filteredVolunteers.map(v => (
                    <div key={v.id} style={{ backgroundColor: '#fafaf8', border: '1px solid #d3d1c7', borderRadius: '12px', padding: '16px' }}>
                      <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>{v.name}</p>
                      <p style={{ fontSize: '13px', color: '#888780', margin: '0 0 4px 0' }}>📧 {v.email}</p>
                      {v.phone && <p style={{ fontSize: '13px', color: '#888780', margin: '0 0 8px 0' }}>📱 {v.phone}</p>}
                      <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', backgroundColor: v.status === 'attended' ? '#eaf3de' : '#e6f1fb', color: v.status === 'attended' ? '#3b6d11' : '#185fa5' }}>{v.status}</span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button onClick={() => handleEdit(v)} style={{ flex: 1, padding: '6px', fontSize: '12px', border: '1px solid #d3d1c7', borderRadius: '4px', backgroundColor: 'transparent' }}>Edit</button>
                        <button onClick={() => handleDelete(v.id)} style={{ flex: 1, padding: '6px', fontSize: '12px', border: '1px solid #f0997b', color: '#993c1d', borderRadius: '4px', backgroundColor: 'transparent' }}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {/* Add view */}
          {view === 'add' && (
            <div style={{ maxWidth: '500px' }}>
              <h2 style={{ marginBottom: '16px' }}>{editingId ? 'Edit' : 'Add'} Volunteer</h2>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Name" style={{ padding: '8px', border: '1px solid #d3d1c7', borderRadius: '6px' }} />
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" style={{ padding: '8px', border: '1px solid #d3d1c7', borderRadius: '6px' }} />
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Phone" style={{ padding: '8px', border: '1px solid #d3d1c7', borderRadius: '6px' }} />
                <input type="text" value={formData.roles} onChange={(e) => setFormData({...formData, roles: e.target.value})} placeholder="Roles" style={{ padding: '8px', border: '1px solid #d3d1c7', borderRadius: '6px' }} />
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ padding: '8px', border: '1px solid #d3d1c7', borderRadius: '6px' }}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="no-show">No show</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleAddEdit} style={{ flex: 1, padding: '10px', backgroundColor: '#378add', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600' }}>Save</button>
                <button onClick={() => { setView('roster'); setEditingId(null); setFormData({ name: '', email: '', phone: '', roles: '', status: 'pending' }); }} style={{ flex: 1, padding: '10px', border: '1px solid #d3d1c7', borderRadius: '6px', backgroundColor: 'transparent' }}>Cancel</button>
              </div>
            </div>
          )}
          {/* Check-in view */}
          {view === 'checkin' && (
            <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '20px' }}>Event Check-in</h2>
              <input type="text" placeholder="Search volunteer..." value={checkinSearch} onChange={(e) => setCheckinSearch(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #d3d1c7', borderRadius: '8px', marginBottom: '16px' }} autoFocus />
              {checkinResult && <div style={{ backgroundColor: '#eaf3de', color: '#3b6d11', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: '500' }}>✓ {checkinResult.name} checked in!</div>}
              {checkinVolunteer && (
                <div style={{ backgroundColor: '#fafaf8', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                  <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>{checkinVolunteer.name}</p>
                  <p style={{ fontSize: '14px', color: '#888780', margin: '0 0 16px 0' }}>{checkinVolunteer.email}</p>
                  <button onClick={() => handleCheckIn(checkinVolunteer)} style={{ width: '100%', padding: '12px', backgroundColor: '#639922', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600' }}>Check in</button>
                </div>
              )}
              {!checkinSearch && <p style={{ color: '#888780', marginTop: '40px' }}>Start typing to find a volunteer</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
