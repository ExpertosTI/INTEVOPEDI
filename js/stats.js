document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Data embedded directly
    const data = {
        "totalSubmissions": 34,
        "visualDisability": {
            "Baja visión": 14,
            "Ceguera total": 20
        },
        "knowsScreenReader": {
            "Sí": 32,
            "No": 2
        },
        "screenReaderUsed": {
            "NVDA": 11,
            "Otro": 5,
            "JAWS": 18
        },
        "wouldUseLicensedJaws": {
            "Sí": 32,
            "No": 2
        },
        "cities": {
            "Sto dgo": 1,
            "Romana": 1,
            "Santo domingo este": 2,
            "Santo dommingo": 1,
            "Calle 4ta. #2 sabana perdidas": 1,
            "Santo domingo, éste": 2,
            "Santo domingo": 6,
            "Distrito nacional": 2,
            "Santo domingo éste": 2,
            "San francisco de macorís": 1,
            "Moca": 1,
            "Puerto plata": 1,
            "Verón;punta cana": 1,
            "Santo domingo, éste, república dominicana": 1,
            "Sabana de la mar": 1,
            "Municipio santo domingo norte san felipe villa mella": 1,
            "Santodomingodistritonacional": 1,
            "Santo domingo norte": 1,
            "Santo domingo ste": 1,
            "New york": 1,
            "Santo domingo distrito nacional.": 1,
            "Nagua": 1,
            "Rio san juan": 1,
            "María trinidad sanchez": 1,
            "Maria trinidad sanchez rio san juan": 1
        }
    };

    try {
        // --- 1. Update KPIs & Insights ---

        // Total
        animateValue("total-submissions", 0, data.totalSubmissions, 1500);

        // Top City
        const sortedCities = Object.entries(data.cities).sort((a, b) => b[1] - a[1]);
        if (sortedCities.length > 0) {
            document.getElementById('top-city-count').textContent = sortedCities[0][0];
            document.getElementById('top-city-detail').textContent = `${sortedCities[0][1]} respuestas recibidas`;
        }

        // JAWS stats
        const jawsCount = data.screenReaderUsed["JAWS"] || 0;
        const totalReaders = Object.values(data.screenReaderUsed).reduce((a, b) => a + b, 0);
        const jawsPercent = totalReaders > 0 ? Math.round((jawsCount / totalReaders) * 100) : 0;
        animateValue("jaws-users-stat", 0, jawsPercent, 1500, "%");

        // Insight Fillers
        const blindCount = data.visualDisability["Ceguera total"] || 0;
        const blindPercent = Math.round((blindCount / data.totalSubmissions) * 100);
        document.getElementById('blindness-stat').textContent = `${blindPercent}%`;

        const knowsCount = data.knowsScreenReader["Sí"] || 0;
        const knowsPercent = Math.round((knowsCount / data.totalSubmissions) * 100);
        document.getElementById('knowledge-stat').textContent = `${knowsPercent}%`;

        const wantJaws = data.wouldUseLicensedJaws["Sí"] || 0;
        document.getElementById('jaws-demand-stat').textContent = wantJaws;


        // --- 2. Chart Configurations & Summaries ---

        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.font.size = 13;
        Chart.defaults.color = 'rgba(100, 116, 139, 0.8)';
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(30, 41, 59, 0.9)';

        const createGradient = (ctx, colorStart, colorEnd) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, colorStart);
            gradient.addColorStop(1, colorEnd);
            return gradient;
        };

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            },
            animation: { duration: 2000, easing: 'easeOutQuart' }
        };

        // Data Breakdown Helper
        const generateListHTML = (obj, total) => {
            let html = '<ul class="summary-list">';
            for (let [key, val] of Object.entries(obj)) {
                const pct = Math.round((val / total) * 100);
                html += `<li><span class="summary-label">${key}</span> <span class="summary-value">${val} (${pct}%)</span></li>`;
            }
            html += '</ul>';
            return html;
        };

        // Chart 1: Visual Disability
        const dCtx = document.getElementById('disabilityChart').getContext('2d');
        const dGradient1 = createGradient(dCtx, '#3b82f6', '#2563eb');
        const dGradient2 = createGradient(dCtx, '#ef4444', '#dc2626');

        new Chart(dCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data.visualDisability),
                datasets: [{
                    data: Object.values(data.visualDisability),
                    backgroundColor: [dGradient2, dGradient1],
                    borderWidth: 0,
                }]
            },
            options: { ...commonOptions, cutout: '70%' }
        });
        document.getElementById('disabilitySummary').innerHTML = generateListHTML(data.visualDisability, data.totalSubmissions);


        // Chart 2: Reader Used
        const rCtx = document.getElementById('readerUsedChart').getContext('2d');
        const rGradient = createGradient(rCtx, '#10b981', '#059669');

        new Chart(rCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(data.screenReaderUsed),
                datasets: [{
                    label: 'Usuarios',
                    data: Object.values(data.screenReaderUsed),
                    backgroundColor: rGradient,
                    borderRadius: 8
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    y: { beginAtZero: true, grid: { display: false }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
        document.getElementById('readerUsedSummary').innerHTML = generateListHTML(data.screenReaderUsed, totalReaders); // approx total

        // Chart 3: Knowledge
        const kCtx = document.getElementById('knowledgeChart').getContext('2d');
        new Chart(kCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(data.knowsScreenReader),
                datasets: [{
                    data: Object.values(data.knowsScreenReader),
                    backgroundColor: ['#8b5cf6', '#cbd5e1'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: commonOptions
        });
        document.getElementById('knowledgeSummary').innerHTML = generateListHTML(data.knowsScreenReader, data.totalSubmissions);

        // Chart 4: Cities
        const cCtx = document.getElementById('citiesChart').getContext('2d');
        const topCities = sortedCities.slice(0, 8);
        const cGradient = createGradient(cCtx, '#f59e0b', '#d97706');

        new Chart(cCtx, {
            type: 'bar',
            data: {
                labels: topCities.map(c => c[0]),
                datasets: [{
                    label: 'Participantes',
                    data: topCities.map(c => c[1]),
                    backgroundColor: cGradient,
                    borderRadius: 6
                }]
            },
            options: {
                ...commonOptions,
                indexAxis: 'y',
                scales: { x: { display: false }, y: { grid: { display: false } } }
            }
        });

        // Chart 5: JAWS Interest
        const jCtx = document.getElementById('jawsInterestChart').getContext('2d');
        new Chart(jCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data.wouldUseLicensedJaws),
                datasets: [{
                    data: Object.values(data.wouldUseLicensedJaws),
                    backgroundColor: ['#22d3ee', '#94a3b8'],
                    borderWidth: 0,
                    circumference: 180,
                    rotation: -90,
                }]
            },
            options: { ...commonOptions, cutout: '60%', aspectRatio: 1.5 }
        });
        document.getElementById('jawsInterestSummary').innerHTML = generateListHTML(data.wouldUseLicensedJaws, data.totalSubmissions);


        // --- Export Feature ---
        const btnExport = document.getElementById('btn-export');
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                downloadCSV(data);
            });
        }


    } catch (error) {
        console.error("Error init stats:", error);
    }
});

function animateValue(id, start, end, duration, suffix = "") {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function downloadCSV(data) {
    // 1. Flatten Data for CSV
    // Simple format: Category, Label, Count
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Categoria,Etiqueta,Valor\n";

    // Add Total
    csvContent += `General,Total Participantes,${data.totalSubmissions}\n`;

    // Helper to add section
    const addSection = (name, obj) => {
        for (let [key, val] of Object.entries(obj)) {
            // Escape commas in keys
            const safeKey = key.includes(',') ? `"${key}"` : key;
            csvContent += `${name},${safeKey},${val}\n`;
        }
    };

    addSection("Discapacidad Visual", data.visualDisability);
    addSection("Conocimiento Lector", data.knowsScreenReader);
    addSection("Lector Utilizado", data.screenReaderUsed);
    addSection("Interés JAWS", data.wouldUseLicensedJaws);
    addSection("Ciudad", data.cities);

    // 2. Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "encuesta_intevopedi_resultados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
