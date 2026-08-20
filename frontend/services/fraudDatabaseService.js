// Community fraud database.
// In-memory store seeded with known scam numbers.
// Swap for a backend API later.

let reportedNumbers = [
  { number: '+254701234567', reports: 3, lastReported: '2026-08-05', note: 'WhatsApp takeover — asked contacts for M-Pesa' },
  { number: '+254722111222', reports: 1, lastReported: '2026-08-08', note: 'OTP scam — posed as Safaricom' },
];

let listeners = [];

export function checkNumber(number) {
  const normalized = normalize(number);
  const match = reportedNumbers.find((r) => normalize(r.number) === normalized);
  if (!match) {
    return { status: 'clean', reports: 0, note: 'No reports found for this number.' };
  }
  return {
    status: match.reports >= 2 ? 'high_risk' : 'flagged',
    reports: match.reports,
    lastReported: match.lastReported,
    note: match.note,
  };
}

export function reportNumber(number, note) {
  const normalized = normalize(number);
  const existing = reportedNumbers.find((r) => normalize(r.number) === normalized);
  if (existing) {
    existing.reports += 1;
    existing.lastReported = new Date().toISOString().slice(0, 10);
    if (note) existing.note = note;
  } else {
    reportedNumbers = [
      ...reportedNumbers,
      { number, reports: 1, lastReported: new Date().toISOString().slice(0, 10), note: note || 'Reported by user' },
    ];
  }
  notify();
  return checkNumber(number);
}

export function getReportedNumbers() {
  return [...reportedNumbers];
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function normalize(number) {
  // Strip spaces, dashes, and leading +/0 for comparison
  return String(number).replace(/[\s\-+]/g, '').replace(/^0/, '254');
}

function notify() {
  listeners.forEach((l) => l(reportedNumbers));
}