import React, { useEffect, useState } from 'react';
import { Star, MapPin, Clock, Video, Calendar, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { doctorService } from '../services/api';

const ConsultDoctor = () => {
  const [doctors, setDoctors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [booking, setBooking]       = useState(null);   // doctor object being booked
  const [scheduled, setScheduled]   = useState('');
  const [notes, setNotes]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(null);
  const [error, setError]           = useState('');

  useEffect(() => {
    doctorService.getAll()
      .then((res) => setDoctors(res.data.data || []))
      .catch(() => setError('Failed to load doctors. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!scheduled) { setError('Please select a date and time.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const { data } = await doctorService.book({
        doctor_id: booking.id,
        scheduled_at: new Date(scheduled).toISOString(),
        notes,
      });
      setSuccess(data.data);
      setBooking(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const RatingStars = ({ rating }) => (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < Math.floor(rating) ? '#F59E0B' : 'none'} color="#F59E0B" />
      ))}
      <span>{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="consult-v2 container animate-fade-up">
      <div className="hdr">
        <div>
          <h1>Consulting Specialists</h1>
          <p>Board-certified neurologists and cognitive health specialists available for secure teleconsultations.</p>
        </div>
      </div>

      {error && (
        <div className="alert-block alert-danger mb-4">
          <AlertCircle size={18} /><span>{error}</span>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="success-banner mb-4">
          <CheckCircle2 size={24} className="text-secondary" />
          <div>
            <strong>Consultation Booked Successfully!</strong>
            <p>Your session with <strong>{success.doctor}</strong> is confirmed for {new Date(success.scheduled_at).toLocaleString()}.</p>
            <a href={success.meeting_url} target="_blank" rel="noreferrer" className="join-link">Join via link →</a>
          </div>
          <button className="close-btn" onClick={() => setSuccess(null)}><X size={20} /></button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--primary)', fontWeight: 600 }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading specialists...
        </div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="card-modern doctor-card-v2">
              <div className="doc-avatar">
                {doc.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="doc-body">
                <h3>{doc.full_name}</h3>
                <p className="doc-spec">{doc.specialty}</p>
                <RatingStars rating={doc.rating || 4.5} />
                <div className="doc-meta">
                  <span><MapPin size={14} /> {doc.location}</span>
                  <span><Clock size={14} /> {doc.experience || '10+'} yrs exp.</span>
                </div>
                <p className="doc-availability">
                  <CheckCircle2 size={14} style={{ color: '#10B981' }} />
                  {doc.availability || 'Available Mon–Fri'}
                </p>
              </div>
              <div className="doc-actions">
                <button className="btn-book" onClick={() => { setBooking(doc); setError(''); }}>
                  <Calendar size={16} /> Book Session
                </button>
                <button className="btn-profile">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {booking && (
        <div className="modal-overlay" onClick={() => setBooking(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setBooking(null)}><X size={22} /></button>
            <div className="modal-header">
              <div className="modal-avatar">{booking.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
              <div>
                <h2>Book with {booking.full_name}</h2>
                <p>{booking.specialty}</p>
              </div>
            </div>

            {error && <div className="alert-block alert-danger" style={{ margin: '16px 0' }}><AlertCircle size={16} /><span>{error}</span></div>}

            <form onSubmit={handleBook} className="booking-form">
              <label>Select Date & Time</label>
              <input
                type="datetime-local"
                min={new Date(Date.now() + 3600000).toISOString().slice(0, 16)}
                value={scheduled}
                onChange={(e) => setScheduled(e.target.value)}
                required
              />
              <label>Notes (optional)</label>
              <textarea
                placeholder="Describe your symptoms or concerns..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <button type="submit" className="btn-submit-booking" disabled={submitting}>
                <Video size={18} />
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .consult-v2 { padding: 40px 0; }
        .hdr { margin-bottom: 32px; }
        .hdr h1 { font-size: 2.2rem; margin-bottom: 8px; }
        .hdr p { color: var(--text-sub); }
        .alert-block { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; }
        .alert-danger { background: #fff1f2; color: #9f1239; border: 1px solid #fecdd3; }
        .success-banner { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 20px 24px; display: flex; align-items: flex-start; gap: 16px; position: relative; }
        .success-banner strong { display: block; margin-bottom: 4px; color: var(--text-main); }
        .success-banner p { color: var(--text-sub); font-size: 0.9rem; }
        .join-link { color: var(--secondary); font-weight: 700; text-decoration: none; font-size: 0.9rem; }
        .close-btn { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: var(--text-muted); }
        .doctor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .doctor-card-v2 { display: flex; gap: 20px; align-items: flex-start; }
        .doc-avatar { width: 64px; height: 64px; border-radius: 16px; background: var(--grad-primary); color: white; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .doc-body { flex: 1; }
        .doc-body h3 { font-size: 1.15rem; margin-bottom: 2px; }
        .doc-spec { color: var(--primary); font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; }
        .stars { display: flex; align-items: center; gap: 2px; margin-bottom: 12px; }
        .stars span { margin-left: 6px; font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
        .doc-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
        .doc-meta span { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--text-sub); font-weight: 500; }
        .doc-availability { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-sub); font-weight: 600; }
        .doc-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
        .btn-book { display: flex; align-items: center; gap: 6px; padding: 10px 16px; background: var(--primary); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.9rem; white-space: nowrap; }
        .btn-profile { padding: 10px 16px; background: var(--surface-alt); border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.9rem; color: var(--text-main); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 500px; position: relative; }
        .modal-close { position: absolute; top: 20px; right: 20px; background: #f1f5f9; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-sub); }
        .modal-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .modal-avatar { width: 56px; height: 56px; border-radius: 14px; background: var(--grad-primary); color: white; font-weight: 800; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
        .modal-header h2 { font-size: 1.4rem; margin-bottom: 4px; }
        .modal-header p { color: var(--primary); font-size: 0.85rem; font-weight: 700; }
        .booking-form { display: flex; flex-direction: column; gap: 14px; }
        .booking-form label { font-size: 0.9rem; font-weight: 600; }
        .booking-form input, .booking-form textarea { padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 10px; font-size: 1rem; width: 100%; box-sizing: border-box; }
        .booking-form input:focus, .booking-form textarea:focus { outline: none; border-color: var(--primary); }
        .btn-submit-booking { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; background: var(--grad-primary); color: white; border: none; border-radius: 14px; font-size: 1.1rem; font-weight: 700; cursor: pointer; }
        .btn-submit-booking:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 768px) { .doctor-card-v2 { flex-direction: column; } .doc-actions { flex-direction: row; } }
      `}</style>
    </div>
  );
};

export default ConsultDoctor;
