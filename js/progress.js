/**
 * INTEVOPEDI - Course Progress Tracking System
 * Manages student progress, achievements, and course completion
 */

class CourseProgressManager {
    constructor() {
        this.storageKey = 'intevopedi_progress';
        this.achievementsKey = 'intevopedi_achievements';
        this.init();
    }

    init() {
        // Load existing progress or initialize new
        this.progress = this.loadProgress();
        this.achievements = this.loadAchievements();
        this.setupEventListeners();
    }

    // ===== STORAGE MANAGEMENT =====
    loadProgress() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : this.getDefaultProgress();
        } catch (error) {
            console.error('Error loading progress:', error);
            return this.getDefaultProgress();
        }
    }

    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
            this.updateProgressUI();
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    getDefaultProgress() {
        return {
            courses: {},
            lastAccessed: null,
            totalPoints: 0,
            completedCourses: 0
        };
    }

    loadAchievements() {
        try {
            const stored = localStorage.getItem(this.achievementsKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading achievements:', error);
            return [];
        }
    }

    saveAchievements() {
        try {
            localStorage.setItem(this.achievementsKey, JSON.stringify(this.achievements));
        } catch (error) {
            console.error('Error saving achievements:', error);
        }
    }

    // ===== PROGRESS TRACKING =====
    initializeCourse(courseId, modulesCount) {
        if (!this.progress.courses[courseId]) {
            this.progress.courses[courseId] = {
                id: courseId,
                completedModules: 0,
                totalModules: modulesCount,
                percentage: 0,
                startedAt: new Date().toISOString(),
                lastAccessed: new Date().toISOString(),
                quizScores: {},
                notes: []
            };
            this.saveProgress();
        }
    }

    completeModule(courseId, moduleId) {
        const course = this.progress.courses[courseId];
        if (!course) {
            console.error('Course not initialized');
            return;
        }

        course.completedModules = Math.min(course.completedModules + 1, course.totalModules);
        course.percentage = Math.round((course.completedModules / course.totalModules) * 100);
        course.lastAccessed = new Date().toISOString();

        // Award points
        this.progress.totalPoints += 10;

        // Check for achievements
        this.checkAchievements(courseId);

        this.saveProgress();
        this.animateProgress(courseId);
    }

    submitQuizScore(courseId, quizId, score, maxScore) {
        const course = this.progress.courses[courseId];
        if (!course) return;

        course.quizScores[quizId] = {
            score,
            maxScore,
            percentage: Math.round((score / maxScore) * 100),
            completedAt: new Date().toISOString()
        };

        // Award bonus points for high scores
        if (score / maxScore >= 0.9) {
            this.progress.totalPoints += 20; // Perfect score bonus
            this.unlockAchievement('quiz_master', 'Quiz Master', '¡Puntuación perfecta!');
        } else if (score / maxScore >= 0.7) {
            this.progress.totalPoints += 10;
        }

        this.saveProgress();
    }

    // ===== ACHIEVEMENTS SYSTEM =====
    checkAchievements(courseId) {
        const course = this.progress.courses[courseId];

        // First module completed
        if (course.completedModules === 1) {
            this.unlockAchievement('first_steps', 'Primeros Pasos', 'Completaste tu primer módulo');
        }

        // 50% progress
        if (course.percentage === 50 && !this.hasAchievement('halfway_there')) {
            this.unlockAchievement('halfway_there', 'A Mitad de Camino', '¡50% del curso completado!');
        }

        // Course completion
        if (course.percentage === 100 && !this.hasAchievement(`complete_${courseId}`)) {
            this.progress.completedCourses += 1;
            this.unlockAchievement(
                `complete_${courseId}`,
                'Curso Completado',
                `¡Felicitaciones por completar ${courseId}!`
            );
            this.showConfetti();
        }

        // Total points milestones
        if (this.progress.totalPoints >= 100 && !this.hasAchievement('points_100')) {
            this.unlockAchievement('points_100', '100 Puntos', '¡Alcanzaste 100 puntos!');
        }
        if (this.progress.totalPoints >= 500 && !this.hasAchievement('points_500')) {
            this.unlockAchievement('points_500', 'Estudiante Dedicado', '¡500 puntos acumulados!');
        }
    }

    hasAchievement(achievementId) {
        return this.achievements.some(a => a.id === achievementId);
    }

    unlockAchievement(id, title, description) {
        if (this.hasAchievement(id)) return;

        const achievement = {
            id,
            title,
            description,
            unlockedAt: new Date().toISOString()
        };

        this.achievements.push(achievement);
        this.saveAchievements();
        this.showAchievementNotification(achievement);
    }

    // ===== UI UPDATES =====
    updateProgressUI() {
        // Update progress bars
        document.querySelectorAll('[data-course-id]').forEach(element => {
            const courseId = element.dataset.courseId;
            const course = this.progress.courses[courseId];

            if (course) {
                const progressBar = element.querySelector('.course-progress-bar');
                const progressText = element.querySelector('.course-progress-text');

                if (progressBar) {
                    progressBar.style.width = `${course.percentage}%`;
                    progressBar.setAttribute('aria-valuenow', course.percentage);
                }

                if (progressText) {
                    progressText.textContent = `${course.percentage}% completado`;
                }
            }
        });

        // Update total points display
        const pointsDisplay = document.getElementById('total-points');
        if (pointsDisplay) {
            pointsDisplay.textContent = this.progress.totalPoints;
        }
    }

    animateProgress(courseId) {
        const courseElement = document.querySelector(`[data-course-id="${courseId}"]`);
        if (!courseElement) return;

        courseElement.classList.add('progress-updated');
        setTimeout(() => {
            courseElement.classList.remove('progress-updated');
        }, 1000);
    }

    showAchievementNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
            <div class="achievement-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
                </svg>
                <div class="achievement-text">
                    <strong>${achievement.title}</strong>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    showConfetti() {
        // Simple confetti animation using CSS
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.setAttribute('aria-hidden', 'true');

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = this.getRandomColor();
            confettiContainer.appendChild(confetti);
        }

        document.body.appendChild(confettiContainer);

        setTimeout(() => confettiContainer.remove(), 5000);
    }

    getRandomColor() {
        const colors = ['#003366', '#C5A059', '#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Module completion buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-complete-module]')) {
                const courseId = e.target.dataset.courseId;
                const moduleId = e.target.dataset.moduleId;
                this.completeModule(courseId, moduleId);
            }
        });

        // Reset progress button (for testing/admin)
        const resetBtn = document.getElementById('reset-progress');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas reiniciar tu progreso? Esta acción no se puede deshacer.')) {
                    this.resetProgress();
                }
            });
        }
    }

    resetProgress() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.achievementsKey);
        this.progress = this.getDefaultProgress();
        this.achievements = [];
        this.updateProgressUI();
        alert('Progreso reiniciado correctamente');
    }

    // ===== DASHBOARD DATA =====
    getDashboardData() {
        const completedCourses = Object.values(this.progress.courses)
            .filter(c => c.percentage === 100).length;

        const inProgressCourses = Object.values(this.progress.courses)
            .filter(c => c.percentage > 0 && c.percentage < 100).length;

        const totalModulesCompleted = Object.values(this.progress.courses)
            .reduce((sum, c) => sum + c.completedModules, 0);

        return {
            totalPoints: this.progress.totalPoints,
            completedCourses,
            inProgressCourses,
            totalModulesCompleted,
            achievements: this.achievements.length,
            recentAchievements: this.achievements.slice(-3).reverse()
        };
    }

    exportProgress() {
        const data = {
            progress: this.progress,
            achievements: this.achievements,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intevopedi_progress_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize progress manager when DOM is ready
let progressManager;

document.addEventListener('DOMContentLoaded', () => {
    progressManager = new CourseProgressManager();

    // Example: Initialize course on course page
    const courseContainer = document.querySelector('[data-course-container]');
    if (courseContainer) {
        const courseId = courseContainer.dataset.courseId;
        const modulesCount = courseContainer.dataset.modulesCount || 10;
        progressManager.initializeCourse(courseId, parseInt(modulesCount));
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourseProgressManager;
}
