'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CourseCard } from '@/components/CourseCard';

export function CourseListClient({ courses }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'Todos';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q');
    if (q !== null && q !== undefined) {
      setSearchTerm(q);
    }
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(courses.map((c) => c.category).filter(Boolean));
    return ['Todos', ...Array.from(cats).sort()];
  }, [courses]);

  // Filter logic
  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.summary.toLowerCase().includes(q) ||
        (course.category && course.category.toLowerCase().includes(q)) ||
        (course.instructor && course.instructor.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'Todos' || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  return (
    <div className="ea-catalog-container">
      {/* Search & Filter Header */}
      <div className="ea-catalog-controls">
        <div className="ea-search-input-wrap">
          <svg className="ea-search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="ea-catalog-search-input"
            placeholder="Buscar por título, docente o tema (ej. Canto, Bajo, IA)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="ea-search-clear-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="ea-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`ea-category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="ea-catalog-results-meta">
        <span>Mostrando <b>{filtered.length}</b> {filtered.length === 1 ? 'curso disponible' : 'cursos disponibles'}</span>
        {(searchTerm || selectedCategory !== 'Todos') && (
          <button
            type="button"
            className="ea-reset-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todos');
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid of Course Cards */}
      {filtered.length > 0 ? (
        <div className="ea-courses-grid">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="ea-empty-state">
          <div className="ea-empty-state-icon">🔍</div>
          <h3>No encontramos cursos para tu búsqueda</h3>
          <p>Prueba con otros términos como <b>Canto</b>, <b>Bajo</b>, <b>Música</b> o <b>Tecnología</b>.</p>
          <button
            type="button"
            className="ea-btn-primary"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todos');
            }}
          >
            Ver todos los cursos
          </button>
        </div>
      )}
    </div>
  );
}
