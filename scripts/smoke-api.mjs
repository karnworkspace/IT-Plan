/**
 * API Integration Smoke Tests for TaskFlow
 * Tests auth, role visibility, CRUD, attachments, pagination.
 *
 * Usage: node scripts/smoke-api.mjs [API_BASE_URL]
 * Default: http://localhost:3100/api/v1
 */

const API = process.argv[2] || 'http://localhost:3100/api/v1';
const PASSWORD = 'Test123!';

let passed = 0;
let failed = 0;
const results = [];

function ok(name) { passed++; results.push(`  ✅ ${name}`); }
function fail(name, detail) { failed++; results.push(`  ❌ ${name}: ${detail}`); }
function expectEqual(name, actual, expected) {
  actual === expected ? ok(`${name} (${actual})`) : fail(name, `expected ${expected}, got ${actual}`);
}
function expectStatus(name, status, expected) {
  status === expected ? ok(`${name} (HTTP ${status})`) : fail(name, `expected HTTP ${expected}, got ${status}`);
}

async function api(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ...data };
}

// 1x1 red PNG (68 bytes)
const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const PNG_BYTES = Uint8Array.from(atob(PNG_BASE64), c => c.charCodeAt(0));

async function uploadImage(path, token) {
  const fd = new FormData();
  fd.append('images', new Blob([PNG_BYTES], { type: 'image/png' }), 'test-smoke.png');
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  return { status: res.status, ...(await res.json().catch(() => ({}))) };
}

async function uploadInvalidFile(path, token) {
  const fd = new FormData();
  fd.append('images', new Blob(['not an image'], { type: 'text/plain' }), 'test.txt');
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  return { status: res.status, ...(await res.json().catch(() => ({}))) };
}

async function main() {
  console.log(`\n🔬 API Smoke Tests → ${API}\n`);

  // ── 1. Health ──
  {
    const r = await api('GET', '/health');
    r.success ? ok('Health check') : fail('Health check', r.error);
  }

  // ── 2. Auth ──
  let adminToken, mgrToken, mbrToken;
  {
    const r = await api('POST', '/auth/login', { email: 'test-admin@test.com', password: PASSWORD });
    r.success ? ok('Admin login') : fail('Admin login', r.error);
    adminToken = r.data?.accessToken;
  }
  {
    const r = await api('POST', '/auth/login', { email: 'test-manager@test.com', password: PASSWORD });
    r.success ? ok('Manager login') : fail('Manager login', r.error);
    mgrToken = r.data?.accessToken;
  }
  {
    const r = await api('POST', '/auth/login', { email: 'test-member@test.com', password: PASSWORD });
    r.success ? ok('Member login') : fail('Member login', r.error);
    mbrToken = r.data?.accessToken;
  }
  {
    const r = await api('POST', '/auth/login', { email: 'wrong@test.com', password: 'wrong' });
    !r.success ? ok('Invalid login rejected') : fail('Invalid login rejected', 'should fail');
  }

  if (!adminToken || !mgrToken || !mbrToken) {
    console.log('\n⛔ Cannot continue — login failed');
    process.exit(1);
  }

  // ── 3. Project visibility (exact counts from deterministic seed) ──
  let projectId;
  {
    const r = await api('GET', '/projects?pageSize=500', null, adminToken);
    const count = r.data?.pagination?.total ?? 0;
    expectEqual('Admin /projects count', count, 1);
    projectId = r.data?.projects?.find(p => p.name === 'Smoke Test Project')?.id;
  }
  {
    const r = await api('GET', '/projects?pageSize=500', null, mgrToken);
    const count = r.data?.pagination?.total ?? 0;
    expectEqual('Manager /projects count', count, 1);
  }
  {
    const r = await api('GET', '/projects?pageSize=500', null, mbrToken);
    const count = r.data?.pagination?.total ?? 0;
    expectEqual('Member /projects count', count, 1);
  }

  // ── 4. My Projects ──
  {
    const r = await api('GET', '/projects/my?pageSize=100', null, mgrToken);
    r.success ? ok('Manager /projects/my') : fail('Manager /projects/my', r.error);
  }

  if (!projectId) {
    console.log('\n⚠️  Smoke Test Project not found — skipping project-specific tests');
  }

  // ── 5. Project detail + tasks ──
  if (projectId) {
    {
      const r = await api('GET', `/projects/${projectId}`, null, adminToken);
      r.success ? ok('Admin project detail') : fail('Admin project detail', r.error);
    }
    {
      const r = await api('GET', `/projects/${projectId}`, null, mbrToken);
      r.success ? ok('Member project detail (is member)') : fail('Member project detail', r.error);
    }
    {
      const r = await api('GET', `/projects/${projectId}/tasks?pageSize=100`, null, adminToken);
      const count = r.data?.pagination?.total ?? 0;
      expectEqual('Admin project tasks count', count, 2);
    }
    {
      const r = await api('GET', `/projects/${projectId}/tasks?pageSize=100`, null, mbrToken);
      const count = r.data?.pagination?.total ?? 0;
      expectEqual('Member project tasks count (assigned only)', count, 1);
    }
    {
      const r = await api('GET', `/projects/${projectId}/stats`, null, adminToken);
      r.success ? ok('Project stats (admin)') : fail('Project stats', r.error);
    }
  }

  // ── 6. My Tasks ──
  let assignedTaskId;
  {
    const r = await api('GET', '/my-tasks?pageSize=500', null, adminToken);
    const count = r.data?.pagination?.total ?? 0;
    expectEqual('Admin /my-tasks count', count, 2);
  }
  {
    const r = await api('GET', '/my-tasks?pageSize=500', null, mbrToken);
    const count = r.data?.pagination?.total ?? 0;
    expectEqual('Member /my-tasks count (assigned only)', count, 1);
    assignedTaskId = r.data?.tasks?.[0]?.id;
  }

  // ── 7. Task detail access ──
  if (assignedTaskId) {
    {
      const r = await api('GET', `/tasks/${assignedTaskId}`, null, mbrToken);
      r.success ? ok('Member task detail (assigned)') : fail('Member task detail', r.error);
    }
  }
  // Unassigned task — member must get 404
  if (projectId) {
    const adminTasks = await api('GET', `/projects/${projectId}/tasks?pageSize=100`, null, adminToken);
    const unassignedTask = adminTasks.data?.tasks?.find(t => t.title === 'Smoke Task Unassigned');
    if (unassignedTask) {
      const r = await api('GET', `/tasks/${unassignedTask.id}`, null, mbrToken);
      expectStatus('Member denied unassigned task', r.status, 404);
    }
  }

  // ── 8. Daily Update create ──
  if (assignedTaskId) {
    const r = await api('POST', `/tasks/${assignedTaskId}/updates`, { notes: 'Smoke test update' }, mbrToken);
    r.success ? ok('Daily update create (notes only)') : fail('Daily update create', r.error);
  }

  // ── 9. Comment create + list ──
  if (assignedTaskId) {
    const r = await api('POST', `/tasks/${assignedTaskId}/comments`, { content: 'Smoke test comment' }, mbrToken);
    r.success ? ok('Comment create') : fail('Comment create', r.error);

    const r2 = await api('GET', `/tasks/${assignedTaskId}/comments`, null, mbrToken);
    r2.success ? ok(`Comment list: ${r2.data?.comments?.length ?? 0} comments`) : fail('Comment list', r2.error);
  }

  // ── 10. Attachment upload + download ──
  if (assignedTaskId) {
    // Create comment for attachment
    const cRes = await api('POST', `/tasks/${assignedTaskId}/comments`, { content: 'attachment test' }, mbrToken);
    const commentId = cRes.data?.comment?.id;
    if (commentId) {
      // Positive: upload valid PNG image
      const upRes = await uploadImage(`/comments/${commentId}/attachments`, mbrToken);
      if (upRes.success) {
        ok('Attachment upload (image/png)');
        const att = upRes.data?.attachments?.[0];
        if (att) {
          const filename = att.path.split('/').pop() || att.path.split('\\').pop();
          const baseUrl = API.replace('/api/v1', '');
          const dlRes = await fetch(`${baseUrl}/uploads/${filename}`);
          dlRes.status === 200 ? ok('Attachment download (static URL)') : fail('Attachment download', `HTTP ${dlRes.status}`);
        }
      } else {
        fail('Attachment upload (image/png)', upRes.error);
      }

      // Negative: upload invalid file type
      const badRes = await uploadInvalidFile(`/comments/${commentId}/attachments`, mbrToken);
      (!badRes.success || badRes.status >= 400) ? ok('Invalid file type rejected') : fail('Invalid file type', 'should reject text/plain');
    }
  }

  // ── 11. Pagination pageSize ──
  {
    const r1 = await api('GET', '/projects?pageSize=1', null, adminToken);
    const returned = r1.data?.projects?.length ?? 0;
    const total = r1.data?.pagination?.total ?? 0;
    (returned <= 1 && total > 0) ? ok(`Pagination: pageSize=1 returned ${returned} of ${total}`) : fail('Pagination', `returned ${returned}`);
  }

  // ── 12. Unauthorized access ──
  {
    const r = await api('GET', '/projects');
    (r.status === 401 || !r.success) ? ok('Unauthenticated /projects rejected') : fail('Unauth', 'should reject');
  }

  // ── Summary ──
  console.log('\n' + results.join('\n'));
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Total: ${passed + failed} | ✅ ${passed} | ❌ ${failed}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
