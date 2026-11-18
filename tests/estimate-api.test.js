
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const express = require('express');

// Tạo database riêng, không sử dụng database thật của dự án.
const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'vuon-toan-api-test-')
);

const originalDbPath = process.env.DB_PATH;
process.env.DB_PATH = path.join(tempDir, 'test.db');

// Phải đặt DB_PATH trước khi require các module này.
const db = require('../server/db');
const api = require('../server/api');
const { attachUser } = require('../server/auth');

let server;
let baseUrl;
let token;
let user;
let estimateSet;
let questions;

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(attachUser(db));
app.use('/api', api);

test.before(async () => {
  // Khởi chạy server trên cổng ngẫu nhiên.
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', resolve);
  });

  baseUrl = `http://127.0.0.1:${server.address().port}`;

  // Tìm một bộ câu hỏi chỉ chứa câu hỏi estimate.
  estimateSet = db.prepare(`
    SELECT qs.id, qs.lesson_id
    FROM question_sets qs
    JOIN questions q ON q.set_id = qs.id
    GROUP BY qs.id
    HAVING
      SUM(CASE WHEN q.type = 'estimate' THEN 1 ELSE 0 END) > 0
      AND
      SUM(CASE WHEN q.type <> 'estimate' THEN 1 ELSE 0 END) = 0
    LIMIT 1
  `).get();

  assert.ok(
    estimateSet,
    'Không tìm thấy bộ câu hỏi chỉ chứa câu hỏi estimate trong seed.json'
  );

  questions = db.prepare(`
    SELECT id, correct_answer, points
    FROM questions
    WHERE set_id = ?
    ORDER BY sort_order
  `).all(estimateSet.id);

  assert.ok(questions.length > 0);

  // Đăng nhập bằng tài khoản học sinh dữ liệu mẫu.
  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'hocsinh01',
      password: '123456',
      role: 'student'
    })
  });

  assert.equal(loginResponse.status, 200);

  const loginData = await loginResponse.json();

  assert.ok(loginData.token, 'API đăng nhập phải trả về token');

  token = loginData.token;
  user = loginData.user;
});

test.after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }

  if (db.open) {
    db.close();
  }

  fs.rmSync(tempDir, { recursive: true, force: true });

  // Khôi phục biến môi trường ban đầu.
  if (originalDbPath === undefined) {
    delete process.env.DB_PATH;
  } else {
    process.env.DB_PATH = originalDbPath;
  }
});

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

// Tạo đáp án hợp lệ dựa trên dữ liệu kiểm thử trong database.
// Dữ liệu đáp án này chỉ được dùng nội bộ trong test.
function createCorrectAnswers() {
  const answers = {};

  for (const question of questions) {
    const [exactText, rangeText] =
      String(question.correct_answer).split('|');

    assert.ok(exactText && rangeText, 'Sai định dạng đáp án lưu trong DB');

    const [minText, maxText] = rangeText.split('-');

    assert.ok(minText && maxText, 'Sai định dạng khoảng ước lượng');

    answers[question.id] = {
      lower: Number(minText),
      upper: Number(maxText),
      exact: Number(exactText)
    };
  }

  return answers;
}

test('Kiểm thử API bài ước lượng', async t => {

  await t.test('1. Không đăng nhập thì không được lấy câu hỏi', async () => {
    const response = await fetch(
      `${baseUrl}/api/question-sets/${encodeURIComponent(estimateSet.id)}/questions`
    );

    assert.equal(response.status, 401);
  });

  await t.test('2. Không đăng nhập thì không được nộp bài', async () => {
    const response = await fetch(`${baseUrl}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setId: estimateSet.id,
        answers: {}
      })
    });

    assert.equal(response.status, 401);
  });

  await t.test('3. Đăng nhập thành công bằng tài khoản học sinh', async () => {
    assert.ok(token);
    assert.equal(user.role, 'student');
    assert.equal(user.username, 'hocsinh01');
  });

  await t.test('4. GET câu hỏi không làm lộ đáp án đúng', async () => {
    const response = await fetch(
      `${baseUrl}/api/question-sets/${encodeURIComponent(estimateSet.id)}/questions`,
      { headers: authHeaders() }
    );

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.setId, estimateSet.id);
    assert.ok(Array.isArray(data.questions));
    assert.equal(data.questions.length, questions.length);

    for (const question of data.questions) {
      assert.equal(
        Object.hasOwn(question, 'correct_answer'),
        false,
        'Không được trả về correct_answer'
      );

      assert.equal(
        Object.hasOwn(question, 'correctAnswer'),
        false,
        'Không được trả về correctAnswer'
      );

      assert.equal(
        Object.hasOwn(question, 'options_json'),
        false,
        'Không được trả về options_json'
      );
    }
  });

  await t.test('5. Nộp đáp án hợp lệ được server chấm điểm', async () => {
    const answers = createCorrectAnswers();

    const response = await fetch(`${baseUrl}/api/submissions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        setId: estimateSet.id,
        answers,
        durationSec: 30,

        // Giá trị giả để kiểm tra server không tin điểm từ client.
        scorePercent: 0,
        earnedPoints: 0
      })
    });

    assert.equal(response.status, 200);

    const result = await response.json();

    assert.equal(result.scorePercent, 100);
    assert.equal(result.correctCount, questions.length);
    assert.equal(result.totalCount, questions.length);

    assert.ok(Array.isArray(result.detail));

    for (const item of result.detail) {
      assert.equal(item.correct, true);
      assert.ok(item.earnedPoints > 0);
    }
  });

  await t.test('6. Không thể tự gửi điểm cao khi đáp án sai hoặc bỏ trống', async () => {
    const response = await fetch(`${baseUrl}/api/submissions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        setId: estimateSet.id,
        answers: {},

        // Cố tình giả mạo điểm.
        scorePercent: 100,
        earnedPoints: 999999
      })
    });

    assert.equal(response.status, 200);

    const result = await response.json();

    assert.equal(result.scorePercent, 0);
    assert.equal(result.correctCount, 0);
    assert.equal(result.totalCount, questions.length);
  });

  await t.test('7. Bộ câu hỏi không tồn tại phải bị từ chối', async () => {
    const response = await fetch(`${baseUrl}/api/submissions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        setId: 'bo-cau-hoi-khong-ton-tai',
        answers: {}
      })
    });

    assert.equal(response.status, 400);
  });

  await t.test('8. Kết quả nộp bài được lưu trong database', async () => {
    const attempts = db.prepare(`
      SELECT *
      FROM attempts
      WHERE user_id = ? AND ref_id = ?
      ORDER BY id DESC
    `).all(user.id, estimateSet.id);

    // Hai lần nộp ở test 5 và test 6.
    assert.ok(attempts.length >= 2);

    assert.equal(attempts[0].score_percent, 0);
    assert.equal(attempts[1].score_percent, 100);

    const savedAnswers = JSON.parse(attempts[1].answers_json);

    assert.deepEqual(savedAnswers, createCorrectAnswers());

    assert.equal(attempts[1].user_id, user.id);
    assert.equal(attempts[1].ref_id, estimateSet.id);
  });

  await t.test('9. Tiến độ học tập được cập nhật sau khi nộp bài', async () => {
    const progress = db.prepare(`
      SELECT *
      FROM progress
      WHERE user_id = ? AND lesson_id = ?
    `).get(user.id, estimateSet.lesson_id);

    assert.ok(progress, 'Chưa tìm thấy tiến độ sau khi nộp bài');
    assert.equal(progress.best_score, 100);
    assert.equal(progress.completed, 1);
  });
});
