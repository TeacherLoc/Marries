// Admin Dashboard Functions

// Export RSVPs to CSV
function exportRSVPsToCSV() {
    const table = document.querySelector('.rsvp-table');
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        let csvRow = [];

        cols.forEach(col => {
            csvRow.push('"' + col.textContent.trim().replace(/"/g, '""') + '"');
        });

        csv.push(csvRow.join(','));
    });

    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp_list_' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Print RSVPs
function printRSVPs() {
    window.print();
}

// Filter RSVPs
function filterRSVPs(status) {
    const rows = document.querySelectorAll('.rsvp-table tbody tr');

    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else if (status === 'attending') {
            row.style.display = row.classList.contains('attending') ? '' : 'none';
        } else if (status === 'not-attending') {
            row.style.display = row.classList.contains('not-attending') ? '' : 'none';
        }
    });
}

// Search RSVPs
function searchRSVPs(searchTerm) {
    const rows = document.querySelectorAll('.rsvp-table tbody tr');
    const term = searchTerm.toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + E to export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportRSVPsToCSV();
    }
    // Ctrl/Cmd + P to print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printRSVPs();
    }
});

console.log('Admin Dashboard Loaded');
