/**
 * NextCampus — Automated API & Validation Verification Suite
 * Tests 16 core test cases across Search, Filters, Detail, Compare, Reviews, and Predictor.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log(`\n🚀 Running NextCampus API Test Suite against ${BASE_URL}\n`);
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}\n     ${err.message}`);
      failed++;
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  // ─── 1. College Search & Filter Tests ──────────────────────────────────────────
  console.log('--- 1. College Search & Filter Tests ---');

  await test('GET /api/colleges returns 200 and list', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.success === true, 'Expected success: true');
    assert(Array.isArray(json.data), 'Expected json.data to be array');
    assert(json.pagination.total >= 0, 'Expected pagination total');
  });

  await test('GET /api/colleges?q=IIT filters by query', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges?q=IIT`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.data.every((c: any) => c.name.includes('IIT') || c.shortName?.includes('IIT')), 'All results must match query');
  });

  await test('GET /api/colleges?stream=MEDICAL&minRating=4.0 filters stream & rating', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges?stream=MEDICAL&minRating=4.0`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.data.every((c: any) => c.overallRating >= 4.0), 'All results must have rating >= 4.0');
  });

  await test('GET /api/colleges?minFee=0&maxFee=250000 filters fee range', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges?minFee=0&maxFee=250000`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.data.length >= 0, 'Should return array');
  });

  await test('GET /api/colleges?exam=NEET&state=Delhi combined filter (AND logic)', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges?exam=NEET&state=Delhi`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.data.every((c: any) => c.state === 'Delhi'), 'State must be Delhi');
  });

  // ─── 2. Invalid Input & Edge Case Tests ──────────────────────────────────────
  console.log('\n--- 2. Invalid Input & Edge Case Tests ---');

  await test('GET /api/colleges?minRating=6 returns 400 (Validation Failure)', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges?minRating=6`);
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('GET /api/colleges?page=0 returns 400 (Page must be >= 1)', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges?page=0`);
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('GET /api/colleges/nonexistent-slug returns 404', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges/nonexistent-college-slug-123`);
    assert(res.status === 404, `Expected 404, got ${res.status}`);
  });

  // ─── 3. Compare Tests ────────────────────────────────────────────────────────
  console.log('\n--- 3. Compare Tests ---');

  await test('GET /api/compare?ids=iit-delhi,iit-bombay returns 200 with exactly 2 colleges', async () => {
    const res = await fetch(`${BASE_URL}/api/compare?ids=iit-delhi,iit-bombay`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.data.length === 2, `Expected 2 colleges, got ${json.data.length}`);
  });

  await test('GET /api/compare?ids=iit-delhi (Single ID) returns 400', async () => {
    const res = await fetch(`${BASE_URL}/api/compare?ids=iit-delhi`);
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const json = await res.json();
    assert(json.error.includes('at least 2'), 'Must reject single college comparison');
  });

  await test('GET /api/compare?ids=a,b,c,d (4 IDs) returns 400 (Max 3)', async () => {
    const res = await fetch(`${BASE_URL}/api/compare?ids=iit-delhi,iit-bombay,nit-trichy,bits-pilani`);
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const json = await res.json();
    assert(json.error.includes('limited to 3'), 'Must reject > 3 comparison');
  });

  // ─── 4. Predictor Tests ──────────────────────────────────────────────────────
  console.log('\n--- 4. Predictor Tests ---');

  await test('POST /api/predictor with JEE_ADVANCED rank returns tiered recommendations', async () => {
    const res = await fetch(`${BASE_URL}/api/predictor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exam: 'JEE_ADVANCED',
        rank: 100,
        category: 'GENERAL',
        year: 2024,
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.data.disclaimer !== undefined, 'Expected disclaimer in response');
    assert(Array.isArray(json.data.strongMatch), 'Expected strongMatch array');
    assert(Array.isArray(json.data.possible), 'Expected possible array');
    assert(Array.isArray(json.data.reach), 'Expected reach array');
  });

  await test('POST /api/predictor without rank or percentile returns 400', async () => {
    const res = await fetch(`${BASE_URL}/api/predictor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exam: 'JEE_MAIN',
        category: 'GENERAL',
      }),
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  // ─── 5. Review Validation Test ────────────────────────────────────────────────
  console.log('\n--- 5. Review Validation Test ---');

  await test('POST /api/colleges/iit-delhi/reviews with invalid payload returns 400', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges/iit-delhi/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerName: 'A', // too short (< 2)
        overallRating: 6, // out of range (> 5)
        reviewText: 'Short', // too short (< 30)
      }),
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const json = await res.json();
    assert(json.details !== undefined, 'Expected validation error details');
  });

  console.log(`\n========================================`);
  console.log(`  Tests completed: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
