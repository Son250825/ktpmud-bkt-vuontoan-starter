

'use strict';

// Chuyển dữ liệu đầu vào thành số hợp lệ.
function parseNumber(value) {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ''
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

// Phân tích đáp án chuẩn lưu trong database.
// Đáp án chuẩn có thể có cận thập phân.
function parseStoredAnswer(value) {
  if (typeof value !== 'string') return null;

  const parts = value.split('|');

  if (parts.length !== 2) return null;

  const exact = parseNumber(parts[0]);
  const range = parts[1].split('-');

  if (range.length !== 2) return null;

  const minAllowed = parseNumber(range[0]);
  const maxAllowed = parseNumber(range[1]);

  if (
    exact === null ||
    minAllowed === null ||
    maxAllowed === null ||
    !Number.isSafeInteger(exact) ||
    exact < 0 ||
    minAllowed < 0 ||
    maxAllowed < 0 ||
    minAllowed > exact ||
    exact > maxAllowed ||
    minAllowed > maxAllowed
  ) {
    return null;
  }

  return {
    exact,
    minAllowed,
    maxAllowed
  };
}

// Kiểm tra khoảng ước lượng của học sinh.
// Học sinh chỉ được nhập số nguyên không âm.
function isReasonableEstimate(lower, upper, stored) {
  const L = parseNumber(lower);
  const U = parseNumber(upper);

  if (
    L === null ||
    U === null ||
    !stored ||
    !Number.isSafeInteger(L) ||
    !Number.isSafeInteger(U) ||
    L < 0 ||
    U < 0
  ) {
    return false;
  }

  return (
    L < U &&
    L >= stored.minAllowed &&
    L <= stored.exact &&
    stored.exact <= U &&
    U <= stored.maxAllowed
  );
}

// Phân loại phản hồi.
function classifyFeedback(estimateCorrect, exactCorrect) {
  if (estimateCorrect && exactCorrect) {
    return 'Làm tốt cả hai bước!';
  }

  if (estimateCorrect) {
    return 'Ước lượng hợp lý, nhưng kết quả tính chưa chính xác.';
  }

  if (exactCorrect) {
    return 'Tính đúng kết quả, nhưng khoảng ước lượng chưa hợp lý.';
  }

  return 'Cả khoảng ước lượng và kết quả tính đều chưa chính xác.';
}

// Hàm chấm điểm chính.
function gradeEstimate(correctAnswer, answer = {}, points = 5) {
  const stored = parseStoredAnswer(correctAnswer);

  const estimateCorrect = isReasonableEstimate(
    answer.lower,
    answer.upper,
    stored
  );

  const exact = parseNumber(answer.exact);

  const exactCorrect =
    stored !== null &&
    exact !== null &&
    Number.isSafeInteger(exact) &&
    exact >= 0 &&
    exact === stored.exact;

  const estimatePoints = Math.round(points * 0.6);
  const exactPoints = points - estimatePoints;

  const earnedPoints =
    (estimateCorrect ? estimatePoints : 0) +
    (exactCorrect ? exactPoints : 0);

  return {
    correct: estimateCorrect && exactCorrect,
    estimateCorrect,
    exactCorrect,
    earnedPoints,
    feedback: classifyFeedback(estimateCorrect, exactCorrect)
  };
}

module.exports = {
  parseNumber,
  parseStoredAnswer,
  isReasonableEstimate,
  classifyFeedback,
  gradeEstimate
};
