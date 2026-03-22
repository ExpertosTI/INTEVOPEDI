'use client';

import { useState } from 'react';

export function SearchFilter({ courses = [], onFilter }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...new Set(courses.map((c) => c.modality).filter(Boolean))];

  function handleSearch(newQuery, newCategory) {
    const q = (newQuery ?? query).toLowerCase().trim();
    const cat = newCategory ?? category;

    const filtered = courses.filter((course) => {
      const matchesQuery = !q ||
        course.title.toLowerCase().includes(q) ||
        course.summary.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q);
      const matchesCategory = cat === 'all' || course.modality === cat;
      return matchesQuery && matchesCategory;
    });

    onFilter(filtered);
  }

  return (
    <div className="stack gap-sm">
      <div className="search-bar">
        <span className="search-bar-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          placeholder="Buscar cursos por título, tema o instructor..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value, category);
          }}
          aria-label="Buscar cursos"
        />
      </div>
      <div className="filter-pills" role="group" aria-label="Filtrar por modalidad">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-pill ${category === cat ? 'active' : ''}`}
            onClick={() => {
              setCategory(cat);
              handleSearch(query, cat);
            }}
          >
            {cat === 'all' ? 'Todos' : cat}
          </button>
        ))}
      </div>
    </div>
  );
}
