'use client';

import { useState, useMemo } from 'react';
import { CourseCard } from '@/components/CourseCard';
import { SearchFilter } from '@/components/SearchFilter';

export function CourseListClient({ courses }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category).filter(Boolean));
    return ['Todos', ...Array.from(cats).sort()];
  }, [courses]);

  // Filtrado combinado (Búsqueda + Categoría)
  const filtered = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  return (
    <div className="stack" style={{ gap: '2rem' }}>
      <div className="section-heading" style={{ marginBottom: '0' }}>
        <SearchFilter 
          courses={courses} 
          onFilter={(list) => {}} // No lo usaremos directamente, manejaremos el término nosotros para combinar
          onSearchChange={setSearchTerm}
        />
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filtered.length > 0 ? (
          filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="panel stack text-center" style={{ padding: '4rem 2rem' }}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3>No encontramos cursos</h3>
            <p>Intenta con otra categoría o término de búsqueda.</p>
            <button className="button button-secondary" onClick={() => { setSelectedCategory('Todos'); setSearchTerm(''); }}> Ver todos los cursos </button>
          </div>
        )}
      </div>
      
      <p className="helper" style={{ textAlign: 'center', opacity: 0.6 }}>
        Mostrando {filtered.length} de {courses.length} cursos disponibles.
      </p>
    </div>
  );
}
