'use client';

import { useState } from 'react';

export function SearchFilter({ courses = [], onFilter, onSearchChange }) {
  const [query, setQuery] = useState('');
  const [modality, setModality] = useState('all');

  const modalities = ['all', ...new Set(courses.map((c) => c.modality).filter(Boolean))];

  function handleFilter(newQuery, newModality) {
    const q = (newQuery !== undefined ? newQuery : query).toLowerCase().trim();
    const mod = newModality !== undefined ? newModality : modality;

    if (onSearchChange) {
      onSearchChange(q);
    }

    const filtered = courses.filter((course) => {
      const matchesQuery = !q ||
        course.title.toLowerCase().includes(q) ||
        course.summary.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q);
      const matchesModality = mod === 'all' || course.modality === mod;
      return matchesQuery && matchesModality;
    });

    if (onFilter) onFilter(filtered);
  }

  return (
    <div className="stack" style={{ gap: '1rem' }}>
      <div className="search-bar">
        <span className="search-bar-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          placeholder="Buscar cursos por título, tema o instructor..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleFilter(e.target.value, modality);
          }}
          aria-label="Buscar cursos"
        />
      </div>
      <div className="filter-pills" role="group" aria-label="Filtrar por modalidad">
        {modalities.map((mod) => (
          <button
            key={mod}
            type="button"
            className={`filter-pill ${modality === mod ? 'active' : ''}`}
            onClick={() => {
              setModality(mod);
              handleFilter(query, mod);
            }}
          >
            {mod === 'all' ? 'Todas las modalidades' : mod}
          </button>
        ))}
      </div>
    </div>
  );
}
