
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const E = require('../server/estimate');

const CORRECT_ANSWER = '24|19.2-28.8';
const STORED = E.parseStoredAnswer(CORRECT_ANSWER);


// NHÓM A: KIỂM TRA CHẤM ĐIỂM 3 + 2

test('EST-01: Ước lượng đúng và tính đúng được 5 điểm', () => {
  const result = E.gradeEstimate(CORRECT_ANSWER, {
    lower: 20,
    upper: 28,
    exact: 24
  });

  assert.equal(result.earnedPoints, 5);
  assert.equal(result.estimateCorrect, true);
  assert.equal(result.exactCorrect, true);
  assert.equal(result.correct, true);
});

test('EST-02: Chỉ ước lượng đúng được 3 điểm', () => {
  const result = E.gradeEstimate(CORRECT_ANSWER, {
    lower: 20,
    upper: 28,
    exact: 25
  });

  assert.equal(result.earnedPoints, 3);
  assert.equal(result.estimateCorrect, true);
  assert.equal(result.exactCorrect, false);
  assert.equal(result.correct, false);
});

test('EST-03: Chỉ tính đúng kết quả được 2 điểm', () => {
  const result = E.gradeEstimate(CORRECT_ANSWER, {
    lower: 10,
    upper: 15,
    exact: 24
  });

  assert.equal(result.earnedPoints, 2);
  assert.equal(result.estimateCorrect, false);
  assert.equal(result.exactCorrect, true);
  assert.equal(result.correct, false);
});

test('EST-04: Cả ước lượng và kết quả đều sai được 0 điểm', () => {
  const result = E.gradeEstimate(CORRECT_ANSWER, {
    lower: 10,
    upper: 15,
    exact: 25
  });

  assert.equal(result.earnedPoints, 0);
  assert.equal(result.estimateCorrect, false);
  assert.equal(result.exactCorrect, false);
  assert.equal(result.correct, false);
});


// NHÓM B: KIỂM TRA BIÊN KHOẢNG ƯỚC LƯỢNG

test('EST-05: Cận dưới là số nguyên hợp lệ gần biên dưới', () => {
  assert.equal(
    E.isReasonableEstimate(20, 24, STORED),
    true
  );
});

test('EST-06: Cận trên là số nguyên hợp lệ gần biên trên', () => {
  assert.equal(
    E.isReasonableEstimate(24, 28, STORED),
    true
  );
});

test('EST-07: Từ chối khoảng ước lượng nằm ngoài giới hạn cho phép', () => {
  const invalidCases = [
    { lower: 19, upper: 24 },
    { lower: 24, upper: 29 },
    { lower: '9'.repeat(30), upper: 28 }
  ];

  for (const answer of invalidCases) {
    const result = E.gradeEstimate(CORRECT_ANSWER, {
      ...answer,
      exact: 24
    });

    assert.equal(result.estimateCorrect, false);
    assert.equal(result.exactCorrect, true);
    assert.equal(result.earnedPoints, 2);
  }
});

test('EST-08: Cận dưới bằng cận trên', () => {
  assert.equal(
    E.isReasonableEstimate(24, 24, STORED),
    false
  );
});

test('EST-09: Cận dưới lớn hơn cận trên', () => {
  assert.equal(
    E.isReasonableEstimate(25, 24, STORED),
    false
  );
});


// NHÓM C: KIỂM TRA ĐẦU VÀO

test('EST-10: Thiếu cận dưới', () => {
  assert.equal(
    E.isReasonableEstimate(undefined, 28, STORED),
    false
  );
});

test('EST-11: Thiếu cận trên', () => {
  assert.equal(
    E.isReasonableEstimate(20, undefined, STORED),
    false
  );
});

test('EST-12: Đầu vào rỗng hoặc chỉ có khoảng trắng', () => {
  assert.equal(
    E.isReasonableEstimate('', 28, STORED),
    false
  );

  assert.equal(
    E.isReasonableEstimate(20, '   ', STORED),
    false
  );
});

test('EST-13: Đầu vào không phải số', () => {
  assert.equal(
    E.isReasonableEstimate('abc', 28, STORED),
    false
  );

  assert.equal(
    E.isReasonableEstimate(20, 'abc', STORED),
    false
  );
});

test('EST-14: Chấp nhận số nguyên có khoảng trắng, từ chối số thập phân', () => {
  assert.equal(
    E.isReasonableEstimate(' 20 ', ' 28 ', STORED),
    true
  );

  assert.equal(
    E.isReasonableEstimate('19.5', 28, STORED),
    false
  );

  assert.equal(
    E.isReasonableEstimate(20, '28.5', STORED),
    false
  );
});

test('EST-15: parseNumber từ chối dữ liệu không hợp lệ', () => {
  for (const value of [
    '',
    '   ',
    null,
    undefined,
    'abc',
    NaN,
    Infinity,
    -Infinity
  ]) {
    assert.equal(E.parseNumber(value), null);
  }

  assert.equal(E.parseNumber('4.5'), 4.5);
  assert.equal(E.parseNumber('  50 '), 50);
});


// NHÓM D: KIỂM TRA ĐÁP ÁN LƯU TRONG DATABASE

test('EST-16: Phân tích đáp án lưu trữ có cận thập phân hợp lệ', () => {
  assert.deepEqual(
    E.parseStoredAnswer(CORRECT_ANSWER),
    {
      exact: 24,
      minAllowed: 19.2,
      maxAllowed: 28.8
    }
  );
});

test('EST-17: Từ chối khoảng có cận dưới lớn hơn cận trên', () => {
  assert.equal(
    E.parseStoredAnswer('24|28.8-19.2'),
    null
  );
});

test('EST-18: Từ chối đáp án lưu sai định dạng', () => {
  for (const value of [
    '24|abc',
    '24|19.2',
    '24|19.2-28.8-30',
    '',
    null,
    undefined
  ]) {
    assert.equal(E.parseStoredAnswer(value), null);
  }
});

test('EST-19: Từ chối khoảng không chứa đáp án chính xác', () => {
  assert.equal(
    E.parseStoredAnswer('24|25-30'),
    null
  );

  assert.equal(
    E.parseStoredAnswer('24|10-20'),
    null
  );
});


// NHÓM E: PHẢN HỒI VÀ TÍNH ỔN ĐỊNH

test('EST-20: Bốn tổ hợp kết quả có bốn phản hồi khác nhau', () => {
  const feedbacks = [
    E.classifyFeedback(true, true),
    E.classifyFeedback(true, false),
    E.classifyFeedback(false, true),
    E.classifyFeedback(false, false)
  ];

  assert.equal(new Set(feedbacks).size, 4);
});

test('EST-21: Kết quả chấm điểm luôn tất định khi chạy lặp', () => {
  const answer = {
    lower: 20,
    upper: 28,
    exact: 24
  };

  const first = E.gradeEstimate(CORRECT_ANSWER, answer);

  for (let i = 0; i < 1000; i++) {
    assert.deepEqual(
      E.gradeEstimate(CORRECT_ANSWER, answer),
      first
    );
  }
});


// NHÓM F: KIỂM TRA 12 CÂU HỎI FIXTURE

test('EST-22: Kiểm tra đầy đủ 12 câu hỏi ước lượng trong seed', () => {
  const seed = require('../data/seed.json');

  const questionSet = seed.questionSets['uoc-luong-nhan-chia-6'];

  assert.ok(questionSet, 'Không tìm thấy bộ câu hỏi ước lượng');

  const questions = questionSet.questions.filter(
    question => question.type === 'estimate'
  );

  assert.equal(questions.length, 12, 'Phải có đủ 12 câu hỏi');

  questions.forEach(question => {
    assert.equal(question.points, 5, `${question.id}: Phải có 5 điểm`);

    const stored = E.parseStoredAnswer(question.correctAnswer);

    assert.ok(stored, `${question.id}: Đáp án lưu trữ không hợp lệ`);

    assert.ok(
      stored.minAllowed <= stored.exact &&
      stored.exact <= stored.maxAllowed,
      `${question.id}: Khoảng cho phép phải chứa đáp án chính xác`
    );
  });
});
