'use client';

import { useState } from 'react';
import { CourseCard } from '@/components/CourseCard';
import { SearchFilter } from '@/components/SearchFilter';

export function CourseListClient({ courses }) {
  const [filtered, setFiltered] = useState(courses);

  return (
    <>
      <SearchFilter courses={courses} onFilter={setFiltered} />
      <div className="card-grid">
        {filtered.length > 0 ? (
          filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className="helper">No se encontraron cursos con ese criterio.</p>
        )}
      </div>
      <p className="helper" style={{ marginTop: '8px' }}>
        Mostrando {filtered.length} de {courses.length} curso(s).
      </p>
    </>
  );
}
