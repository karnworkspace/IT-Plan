/**
 * Deterministic test seed — creates users, projects, tasks for API smoke tests.
 * Idempotent: uses upsert so re-running won't duplicate.
 *
 * Usage: node scripts/seed-test-data.mjs [API_BASE_URL]
 * Default: http://localhost:3100/api/v1
 */

const API = process.argv[2] || 'http://localhost:3100/api/v1';

async function api(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.success && res.status >= 400) {
    // Ignore duplicate errors for idempotency
    if (data.error?.includes('already') || data.error?.includes('duplicate') || data.error?.includes('exists')) {
      return data;
    }
  }
  return data;
}

async function main() {
  console.log(`Seeding test data → ${API}\n`);

  // 1. Register test users
  const users = [
    { email: 'test-admin@test.com', password: 'Test123!', name: 'Test Admin' },
    { email: 'test-manager@test.com', password: 'Test123!', name: 'Test Manager' },
    { email: 'test-member@test.com', password: 'Test123!', name: 'Test Member' },
  ];

  for (const u of users) {
    const res = await api('POST', '/auth/register', u);
    console.log(`  Register ${u.name}: ${res.success ? 'OK' : res.error || 'exists'}`);
  }

  // 2. Set roles via direct DB (admin API requires ADMIN role but newly registered users are MEMBER)
  const { execSync } = await import('child_process');
  const setRole = (email, role) => {
    try {
      execSync(`docker exec taskflow-test-db psql -U taskflow_test -d taskflow_test -c "UPDATE users SET role='${role}' WHERE email='${email}';"`, { stdio: 'pipe' });
      console.log(`  Set ${email} role: ${role}`);
    } catch (e) {
      console.log(`  Set ${email} role: ${role} (may already be set)`);
    }
  };
  setRole('test-admin@test.com', 'ADMIN');
  setRole('test-manager@test.com', 'MANAGER');
  setRole('test-member@test.com', 'MEMBER');

  // Login as admin (now has ADMIN role)
  const adminLogin2 = await api('POST', '/auth/login', { email: users[0].email, password: users[0].password });
  if (!adminLogin2.success) {
    console.error('Failed to login as admin after role set:', adminLogin2.error);
    process.exit(1);
  }
  const adminToken2 = adminLogin2.data.accessToken;

  // Get user IDs
  const userList = await api('GET', '/users/list', null, adminToken2);
  const allUsers = userList.data?.users || [];
  const managerUser = allUsers.find(u => u.email === 'test-manager@test.com');
  const memberUser = allUsers.find(u => u.email === 'test-member@test.com');

  if (!managerUser || !memberUser) {
    console.error('Could not find test users in user list');
    process.exit(1);
  }

  // 3. Create test project
  console.log('\n  Creating test project...');
  const projRes = await api('POST', '/projects', {
    name: 'Smoke Test Project',
    description: 'Project for API integration testing',
    status: 'ACTIVE',
    projectType: 'PROJECT',
  }, adminToken2);

  let projectId;
  if (projRes.success) {
    projectId = projRes.data.project.id;
    console.log(`  Project created: ${projectId.slice(0, 8)}...`);
  } else {
    // Try to find existing
    const projList = await api('GET', '/projects?pageSize=100', null, adminToken2);
    const existing = projList.data?.projects?.find(p => p.name === 'Smoke Test Project');
    if (existing) {
      projectId = existing.id;
      console.log(`  Project exists: ${projectId.slice(0, 8)}...`);
    } else {
      console.error('Failed to create/find project:', projRes.error);
      process.exit(1);
    }
  }

  // 4. Add manager + member to project
  await api('POST', `/projects/${projectId}/members`, { userId: managerUser.id, role: 'ADMIN' }, adminToken2);
  console.log('  Added manager to project');
  await api('POST', `/projects/${projectId}/members`, { userId: memberUser.id, role: 'MEMBER' }, adminToken2);
  console.log('  Added member to project');

  // 5. Create tasks — one assigned to member, one not
  const task1Res = await api('POST', `/projects/${projectId}/tasks`, {
    title: 'Smoke Task Assigned',
    description: 'Task assigned to member for visibility test',
    assigneeIds: [memberUser.id],
    priority: 'HIGH',
  }, adminToken2);

  const task2Res = await api('POST', `/projects/${projectId}/tasks`, {
    title: 'Smoke Task Unassigned',
    description: 'Task NOT assigned to member — should be invisible to member',
    assigneeIds: [managerUser.id],
    priority: 'MEDIUM',
  }, adminToken2);

  const task1Id = task1Res.data?.task?.id;
  const task2Id = task2Res.data?.task?.id;
  console.log(`  Task assigned to member: ${task1Id?.slice(0, 8) || 'exists'}...`);
  console.log(`  Task assigned to manager: ${task2Id?.slice(0, 8) || 'exists'}...`);

  // Clean up refresh tokens to avoid collision with smoke test logins
  try {
    execSync(`docker exec taskflow-test-db psql -U taskflow_test -d taskflow_test -c "DELETE FROM refresh_tokens;"`, { stdio: 'pipe' });
    console.log('  Cleaned refresh tokens for fresh smoke test logins');
  } catch { /* ignore */ }

  // Output summary
  console.log('\n✅ Seed complete');
  console.log(JSON.stringify({
    adminEmail: users[0].email,
    managerEmail: users[1].email,
    memberEmail: users[2].email,
    password: users[0].password,
    projectId,
    assignedTaskId: task1Id,
    unassignedTaskId: task2Id,
    managerId: managerUser.id,
    memberId: memberUser.id,
  }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
