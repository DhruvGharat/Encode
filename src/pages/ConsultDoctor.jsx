import React from 'react';
import {
    User,
    Star,
    MapPin,
    Calendar,
    Video,
    MessageSquare,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';

const ConsultDoctor = () => {
    const doctors = [
        {
            name: 'Dr. Sarah Wilson',
            specialty: 'Cognitive Neurologist',
            rating: '4.9',
            reviews: '128',
            location: 'London, UK / Remote',
            availability: 'Available Today',
            experience: '15 years',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            name: 'Dr. Michael Chen',
            specialty: 'Dementia Specialist',
            rating: '4.8',
            reviews: '94',
            location: 'San Francisco, US / Remote',
            availability: 'Tomorrow',
            experience: '12 years',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200'
        }
    ];

    return (
        <div className="consult-doctor container">
            <header className="page-header">
                <h1>Consult a Specialist</h1>
                <p>Book a video consultation with world-class neurologists specialized in cognitive health.</p>
            </header>

            <div className="doctor-layout">
                <div className="doctor-list">
                    {doctors.map((doctor, i) => (
                        <div key={i} className="card doctor-card-horizontal">
                            <div className="doctor-img-container">
                                <img src={doctor.image} alt={doctor.name} className="doctor-img" />
                                <div className="verified-badge">
                                    <ShieldCheck size={14} />
                                </div>
                            </div>
                            <div className="doctor-info-main">
                                <div className="info-header">
                                    <div>
                                        <h3>{doctor.name}</h3>
                                        <span className="specialty">{doctor.specialty}</span>
                                    </div>
                                    <div className="rating">
                                        <Star size={16} fill="#F1C40F" color="#F1C40F" />
                                        <strong>{doctor.rating}</strong>
                                        <span>({doctor.reviews} reviews)</span>
                                    </div>
                                </div>

                                <div className="info-meta">
                                    <div className="meta-item"><MapPin size={16} /> {doctor.location}</div>
                                    <div className="meta-item"><User size={16} /> {doctor.experience} exp.</div>
                                    <div className="meta-item availability"><Calendar size={16} /> {doctor.availability}</div>
                                </div>

                                <div className="doctor-actions">
                                    <button className="btn-primary">Book Consultation</button>
                                    <button className="btn-outline-sm">Send Message</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="consultation-sidebar">
                    <div className="card next-session">
                        <h3>Upcoming Session</h3>
                        <div className="session-alert">
                            <Calendar size={20} className="text-primary" />
                            <div>
                                <p className="session-date">Monday, Oct 20</p>
                                <p className="session-time">10:30 AM - 11:00 AM</p>
                            </div>
                        </div>
                        <div className="session-doctor">
                            <img src={doctors[0].image} alt="Doctor" className="session-doc-img" />
                            <span>with {doctors[0].name}</span>
                        </div>
                        <button className="btn-secondary full-width mt-4">
                            <Video size={18} /> Join Meeting
                        </button>
                    </div>

                    <div className="card help-center mt-4">
                        <h3>Platform Support</h3>
                        <ul className="help-links">
                            <li>How consultations work <ChevronRight size={16} /></li>
                            <li>Insurance & Billing <ChevronRight size={16} /></li>
                            <li>Preparing for your scan <ChevronRight size={16} /></li>
                        </ul>
                        <div className="emergency-note mt-4">
                            <p>For urgent medical emergencies, please dial 911 or visit your nearest ER.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .consult-doctor {
          padding-top: 40px;
          padding-bottom: 60px;
        }
        .page-header { margin-bottom: 40px; }
        .page-header h1 { font-size: 2.2rem; margin-bottom: 8px; }
        .page-header p { color: var(--text-secondary); font-size: 1.1rem; }

        .doctor-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .doctor-card-horizontal {
          display: flex;
          gap: 25px;
          padding: 25px;
          margin-bottom: 20px;
          transition: transform 0.2s;
        }
        .doctor-card-horizontal:hover { transform: scale(1.01); }

        .doctor-img-container { position: relative; }
        .doctor-img {
          width: 120px;
          height: 120px;
          border-radius: var(--border-radius-md);
          object-fit: cover;
        }
        .verified-badge {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: var(--primary);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .doctor-info-main { flex: 1; display: flex; flex-direction: column; }
        .info-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
        .info-header h3 { font-size: 1.25rem; }
        .specialty { color: var(--primary); font-weight: 600; font-size: 0.9rem; }
        .rating { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; }
        .rating span { color: var(--text-secondary); }

        .info-meta { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--text-secondary); }
        .availability { color: var(--success); font-weight: 500; }

        .doctor-actions { display: flex; gap: 12px; }

        .next-session h3 { margin-bottom: 20px; }
        .session-alert {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f0f7ff;
          padding: 15px;
          border-radius: var(--border-radius-md);
          margin-bottom: 15px;
        }
        .session-date { font-weight: 700; color: var(--primary); font-size: 1rem; }
        .session-time { font-size: 0.85rem; color: var(--text-secondary); }
        .session-doctor { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 500; }
        .session-doc-img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }

        .full-width { width: 100%; }
        .help-center h3 { margin-bottom: 15px; }
        .help-links { list-style: none; }
        .help-links li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
          cursor: pointer;
        }
        .help-links li:hover { color: var(--primary); }
        .emergency-note { background: #fff1f2; padding: 12px; border-radius: 8px; color: #991b1b; font-size: 0.8rem; line-height: 1.4; }

        @media (max-width: 992px) {
          .doctor-layout { grid-template-columns: 1fr; }
          .doctor-card-horizontal { flex-direction: column; align-items: center; text-align: center; }
          .info-header { flex-direction: column; align-items: center; gap: 10px; }
          .info-meta { justify-content: center; }
          .doctor-actions { justify-content: center; }
        }
      `}</style>
        </div>
    );
};

export default ConsultDoctor;
