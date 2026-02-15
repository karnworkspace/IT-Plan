import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Project, Task } from '../types';
import { PROJECT_STATUS_LABELS as STATUS_LABELS, TASK_STATUS_LABELS, PRIORITY_LABELS } from '../constants';

function formatDate(val: string | undefined): string {
  if (!val) return '-';
  return new Date(val).toLocaleDateString('th-TH');
}

async function loadThaiFont(doc: jsPDF) {
  try {
    const [regularRes, boldRes] = await Promise.all([
      fetch('/fonts/Sarabun-Regular.ttf'),
      fetch('/fonts/Sarabun-Bold.ttf'),
    ]);

    const regularBuf = await regularRes.arrayBuffer();
    const boldBuf = await boldRes.arrayBuffer();

    const toBase64 = (buf: ArrayBuffer) => {
      const bytes = new Uint8Array(buf);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    doc.addFileToVFS('Sarabun-Regular.ttf', toBase64(regularBuf));
    doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal');

    doc.addFileToVFS('Sarabun-Bold.ttf', toBase64(boldBuf));
    doc.addFont('Sarabun-Bold.ttf', 'Sarabun', 'bold');

    doc.setFont('Sarabun');
    return true;
  } catch {
    // Fallback to default font if Thai font fails to load
    return false;
  }
}

function addHeader(doc: jsPDF, title: string, subtitle?: string) {
  // Header bar
  doc.setFillColor(26, 26, 46); // #1a1a2e
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('Sarabun', 'bold');
  doc.text('SENA', 14, 12);
  doc.setFontSize(10);
  doc.setFont('Sarabun', 'normal');
  doc.text(title, 14, 20);

  if (subtitle) {
    doc.setFontSize(8);
    doc.text(subtitle, 14, 25);
  }

  // Date stamp
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.setFontSize(8);
  doc.text(today, doc.internal.pageSize.getWidth() - 14, 12, { align: 'right' });

  doc.setTextColor(0, 0, 0);
}

export async function exportProjectsPDF(projects: Project[]) {
  const doc = new jsPDF('landscape');
  await loadThaiFont(doc);

  addHeader(doc, 'Projects Report', `Total: ${projects.length} projects`);

  const rows = projects.map((p, i) => {
    const stats = p.stats;
    const progress = stats && stats.total > 0
      ? `${Math.round((stats.completed / stats.total) * 100)}%`
      : '0%';
    return [
      i + 1,
      p.name || '',
      STATUS_LABELS[p.status] || p.status || '',
      p._count?.tasks ?? 0,
      p._count?.members ?? 0,
      progress,
      formatDate(p.startDate),
      formatDate(p.endDate),
    ];
  });

  autoTable(doc, {
    startY: 32,
    head: [['#', 'Project Name', 'Status', 'Tasks', 'Members', 'Progress', 'Start', 'End']],
    body: rows,
    styles: { fontSize: 9, cellPadding: 3, font: 'Sarabun' },
    headStyles: { fillColor: [102, 126, 234], textColor: 255, fontStyle: 'bold', font: 'Sarabun' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 65 },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 18, halign: 'center' },
      5: { cellWidth: 18, halign: 'center' },
    },
  });

  const today = new Date().toISOString().slice(0, 10);
  doc.save(`SENA_Projects_${today}.pdf`);
}

export async function exportTasksPDF(tasks: Task[], projectName: string) {
  const doc = new jsPDF('landscape');
  await loadThaiFont(doc);

  addHeader(doc, `Tasks - ${projectName}`, `Total: ${tasks.length} tasks`);

  const rows = tasks.map((t, i) => [
    i + 1,
    t.title || '',
    TASK_STATUS_LABELS[t.status] || t.status || '',
    PRIORITY_LABELS[t.priority] || t.priority || '',
    t.assignee?.name || '-',
    `${t.progress || 0}%`,
    formatDate(t.startDate),
    formatDate(t.dueDate),
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['#', 'Task Title', 'Status', 'Priority', 'Assignee', 'Progress', 'Start', 'Finish']],
    body: rows,
    styles: { fontSize: 9, cellPadding: 3, font: 'Sarabun' },
    headStyles: { fillColor: [102, 126, 234], textColor: 255, fontStyle: 'bold', font: 'Sarabun' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 30 },
      5: { cellWidth: 18, halign: 'center' },
    },
  });

  const safeName = projectName.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]/g, '_');
  const today = new Date().toISOString().slice(0, 10);
  doc.save(`SENA_Tasks_${safeName}_${today}.pdf`);
}
