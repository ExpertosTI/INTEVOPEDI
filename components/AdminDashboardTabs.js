'use client';

import { useState } from 'react';
import { AdminWhatsAppScanner } from '@/components/AdminWhatsAppScanner';
import { AdminCourseContentManager } from '@/components/AdminCourseContentManager';

export function AdminDashboardTabs({ courses = [], enrollmentsContent, certificatesContent, manualFormContent }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'whatsapp' | 'enrollments' | 'certificates' | 'manual'

  return (
    <div className="admin-tabs-wrapper stack" style={{ gap: '20px' }}>
      {/* TAB NAVIGATION HEADER */}
      <div
        className="admin-tab-bar"
        style={{
          display: 'flex',
          gap: '8px',
          padding: '6px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflowX: 'auto',
          boxShadow: '0 2px 8px rgba(3, 27, 78, 0.04)'
        }}
      >
        <button
          type="button"
          className={`button ${activeTab === 'courses' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setActiveTab('courses')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '8px', fontWeight: '800' }}
        >
          <span>📚</span>
          <span>Editor de Cursos y Contenido</span>
        </button>

        <button
          type="button"
          className={`button ${activeTab === 'whatsapp' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setActiveTab('whatsapp')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '8px',
            fontWeight: '800',
            background: activeTab === 'whatsapp' ? '#25d366' : undefined,
            borderColor: activeTab === 'whatsapp' ? '#25d366' : undefined
          }}
        >
          <span>💬</span>
          <span>Notificaciones WhatsApp (Escanear QR)</span>
        </button>

        <button
          type="button"
          className={`button ${activeTab === 'enrollments' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setActiveTab('enrollments')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '8px', fontWeight: '800' }}
        >
          <span>👥</span>
          <span>Inscripciones</span>
        </button>

        <button
          type="button"
          className={`button ${activeTab === 'certificates' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setActiveTab('certificates')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '8px', fontWeight: '800' }}
        >
          <span>🎓</span>
          <span>Certificados</span>
        </button>

        <button
          type="button"
          className={`button ${activeTab === 'manual' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setActiveTab('manual')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '8px', fontWeight: '800' }}
        >
          <span>➕</span>
          <span>Crear Curso Rápido</span>
        </button>
      </div>

      {/* TAB CONTENT PANELS */}
      {activeTab === 'courses' && (
        <AdminCourseContentManager initialCourses={courses} />
      )}

      {activeTab === 'whatsapp' && (
        <AdminWhatsAppScanner />
      )}

      {activeTab === 'enrollments' && enrollmentsContent}

      {activeTab === 'certificates' && certificatesContent}

      {activeTab === 'manual' && manualFormContent}
    </div>
  );
}
