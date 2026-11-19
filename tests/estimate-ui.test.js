
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const exercisePath = path.join(
  __dirname,
  '../public/assets/js/pages/exercise.js'
);

const exerciseSource = fs.readFileSync(exercisePath, 'utf8');

const SET_ID = 'uoc-luong-nhan-chia-6';

const questions = [
  { id: 'q1', prompt: '7 × 2 bằng bao nhiêu?', type: 'estimate' },
  { id: 'q2', prompt: '7 × 3 bằng bao nhiêu?', type: 'estimate' },
  { id: 'q3', prompt: '7 × 4 bằng bao nhiêu?', type: 'estimate' }
];

function createFixture() {
  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <div id="estimate-exercise-view" class="hidden">
        <div id="estimate-working-view">
          <div id="estimate-question-nav"></div>
          <div id="estimate-question-list"></div>
        </div>

        <div id="estimate-result-view" class="hidden">
          <div id="estimate-feedback"></div>
        </div>

        <div id="estimate-detail-view" class="hidden">
          <div id="estimate-detail-list"></div>
        </div>
      </div>

      <div id="legacy-exercise-view"></div>
      <div id="display-timer"></div>
      <div id="feedback-modal" class="hidden">
        <h4></h4>
        <p></p>
      </div>
    </body>
    </html>
  `;

  const dom = new JSDOM(html, {
    url: `http://localhost/exercise.html?set=${SET_ID}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  const { window } = dom;

  let postCount = 0;
  let postError = null;

  const api = {
  get: async (url) => {
    if (url.startsWith('/api/question-sets/')) {
      return {
        setId: SET_ID,
        questions
      };
    }

    if (url.startsWith('/api/submissions/latest/')) {
      throw new Error('Chưa có kết quả bài làm.');
    }

    throw new Error(`API GET chưa được mock: ${url}`);
  },

    post: async (url, body) => {
      postCount++;

      if (postError) {
        throw postError;
      }

      return {
        scorePercent: 100,
        correctCount: questions.length,
        totalCount: questions.length,
        starsEarned: 0,
        detail: questions.map(question => ({
          questionId: question.id,
          correct: true,
          estimateCorrect: true,
          exactCorrect: true,
          earnedPoints: 5,
          studentAnswer: body.answers[question.id],
          feedback: 'Chính xác!'
        }))
      };
    }
  };

  window.MathAPI = api;

  // Tránh timer chạy thật trong quá trình kiểm thử.
  window.setInterval = () => 1;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = function () {};
  window.alert = () => {};

  // Chạy mã ứng dụng và mở các hàm cần kiểm thử.
  window.eval(`
    ${exerciseSource}

    window.__estimateTest = {
  loadEstimateQuestions,
  createEstimateQuestion,
  renderCurrentEstimateQuestion,
  renderEstimateQuestionNav,
  collectEstimateAnswers,
  validateAllEstimateAnswers,
  submitEstimateExam,
  submitEstimateAnswers,
  getEstimateDraftKey,
  get questions() { return estimateQuestions; },
  get answers() { return estimateAnswerCache; },
  get currentIndex() { return currentEstimateIndex; },
  set currentIndex(value) { currentEstimateIndex = value; },
  get lastResult() { return estimateLastResult; }
};
  `);

  return {
    dom,
    window,
    document: window.document,
    api,
    get postCount() {
      return postCount;
    },
    set postError(value) {
      postError = value;
    }
  };
}

async function setup() {
  const fixture = createFixture();

  await fixture.window.__estimateTest.loadEstimateQuestions();

  return fixture;
}

function input(document, field, questionId = 'q1') {
  return document.querySelector(
    `[data-question-id="${questionId}"][data-field="${field}"]`
  );
}

function enterValue(fixture, field, value, questionId = 'q1') {
  const element = input(fixture.document, field, questionId);

  assert.ok(element, `Không tìm thấy ô ${field}`);

  element.value = String(value);
  element.dispatchEvent(
    new fixture.window.Event('input', { bubbles: true })
  );

  return element;
}

function fillQuestion(fixture, questionId, lower, upper, exact) {
  enterValue(fixture, 'lower', lower, questionId);
  enterValue(fixture, 'upper', upper, questionId);
  enterValue(fixture, 'exact', exact, questionId);
}

function fillAllQuestions(fixture) {
  questions.forEach((question, index) => {
    // Chuyển đến câu hỏi hiện tại trước khi nhập
    fixture.window.__estimateTest.currentIndex = index;
    fixture.window.__estimateTest.renderCurrentEstimateQuestion();

    const exact = (index + 2) * 7;

    fillQuestion(
      fixture,
      question.id,
      exact - 2,
      exact + 2,
      exact
    );
  });
}

test('UI bài ước lượng', async t => {

  await t.test('UI-01: Tải và hiển thị danh sách câu hỏi', async () => {
    const f = await setup();

    assert.equal(f.__unused, undefined);
    assert.equal(f.window.__estimateTest.questions.length, 3);

    assert.equal(
      f.document.querySelectorAll('.estimate-question-card').length,
      0
    );

    assert.match(
      f.document.getElementById('estimate-question-list').textContent,
      /Câu 1/
    );

    f.dom.window.close();
  });

  await t.test('UI-02: Hiển thị đủ ba ô nhập', async () => {
    const f = await setup();

    assert.ok(input(f.document, 'lower'));
    assert.ok(input(f.document, 'upper'));
    assert.ok(input(f.document, 'exact'));

    assert.equal(input(f.document, 'exact').disabled, true);
    assert.ok(
      input(f.document, 'exact').closest('label').classList.contains('hidden')
    );

    f.dom.window.close();
  });

  await t.test('UI-03: Nhập hai cận hợp lệ thì mở ô kết quả', async () => {
    const f = await setup();

    enterValue(f, 'lower', 12);
    enterValue(f, 'upper', 16);

    assert.equal(input(f.document, 'exact').disabled, false);
    assert.equal(
      input(f.document, 'exact').closest('label').classList.contains('hidden'),
      false
    );

    f.dom.window.close();
  });

  await t.test('UI-04: Cận dưới bằng cận trên không mở ô kết quả', async () => {
    const f = await setup();

    enterValue(f, 'lower', 14);
    enterValue(f, 'upper', 14);

    assert.equal(input(f.document, 'exact').disabled, true);

    assert.match(
      f.document.querySelector('[role="status"]').textContent,
      /bằng nhau/
    );

    f.dom.window.close();
  });

  await t.test('UI-05: Cận dưới lớn hơn cận trên không hợp lệ', async () => {
    const f = await setup();

    enterValue(f, 'lower', 20);
    enterValue(f, 'upper', 10);

    assert.equal(input(f.document, 'exact').disabled, true);

    assert.match(
      f.document.querySelector('[role="status"]').textContent,
      /lớn hơn/
    );

    f.dom.window.close();
  });

  await t.test('UI-06: Nhập chữ vào cận dưới phải báo lỗi', async () => {
    const f = await setup();

    const lower = enterValue(f, 'lower', 'abc');

    assert.equal(lower.getAttribute('aria-invalid'), 'true');

    assert.match(
      f.document.querySelector('[role="status"]').textContent,
      /không hợp lệ/
    );

    f.dom.window.close();
  });

  await t.test('UI-07: Nhập số âm vào cận trên phải báo lỗi', async () => {
    const f = await setup();

    enterValue(f, 'lower', 5);
    const upper = enterValue(f, 'upper', -2);

    assert.equal(upper.getAttribute('aria-invalid'), 'true');
    assert.equal(input(f.document, 'exact').disabled, true);

    f.dom.window.close();
  });

  await t.test('UI-08: Nhập số thập phân không được chấp nhận', async () => {
    const f = await setup();

    const lower = enterValue(f, 'lower', '1.5');

    assert.equal(lower.getAttribute('aria-invalid'), 'true');
    assert.equal(input(f.document, 'exact').disabled, true);

    f.dom.window.close();
  });

  await t.test('UI-09: Nhập số vượt giới hạn an toàn phải bị từ chối', async () => {
    const f = await setup();

    const lower = enterValue(f, 'lower', '999999999999999999999');

    assert.equal(lower.getAttribute('aria-invalid'), 'true');
    assert.equal(input(f.document, 'exact').disabled, true);

    f.dom.window.close();
  });

  await t.test('UI-10: Nhấn Enter ở cận dưới chuyển sang cận trên', async () => {
    const f = await setup();

    const lower = input(f.document, 'lower');

    lower.dispatchEvent(new f.window.KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    }));

    assert.equal(f.document.activeElement.id, 'estimate-upper-q1');

    f.dom.window.close();
  });

  await t.test('UI-11: Nhấn Enter ở cận trên hợp lệ chuyển sang kết quả', async () => {
    const f = await setup();

    enterValue(f, 'lower', 12);
    enterValue(f, 'upper', 16);

    const upper = input(f.document, 'upper');

    upper.dispatchEvent(new f.window.KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    }));

    assert.equal(f.document.activeElement.id, 'estimate-exact-q1');

    f.dom.window.close();
  });

  await t.test('UI-12: Câu trả lời được lưu khi nhập', async () => {
    const f = await setup();

    fillQuestion(f, 'q1', 12, 16, 14);

    const saved = JSON.parse(
      f.window.localStorage.getItem(
        f.window.__estimateTest.getEstimateDraftKey()
      )
    );

    assert.deepEqual(saved.answers.q1, {
      lower: '12',
      upper: '16',
      exact: '14'
    });

    f.dom.window.close();
  });

  await t.test('UI-13: Chuyển câu giữ lại câu trả lời cũ', async () => {
    const f = await setup();

    fillQuestion(f, 'q1', 12, 16, 14);

    f.window.__estimateTest.currentIndex = 0;
    f.window.__estimateTest.renderEstimateQuestionNav();

    const next = [...f.document.querySelectorAll('#estimate-question-list button')]
      .find(button => button.textContent.includes('Câu tiếp theo'));

    assert.ok(next);
    next.click();

    assert.match(
      f.document.getElementById('estimate-question-list').textContent,
      /Câu 2/
    );

    f.window.__estimateTest.currentIndex = 0;
    f.window.__estimateTest.renderCurrentEstimateQuestion();

    assert.equal(input(f.document, 'lower').value, '12');
    assert.equal(input(f.document, 'upper').value, '16');
    assert.equal(input(f.document, 'exact').value, '14');

    f.dom.window.close();
  });

  await t.test('UI-14: Thanh tiến độ cập nhật khi hoàn thành câu', async () => {
    const f = await setup();

    fillQuestion(f, 'q1', 12, 16, 14);

    const progress = f.document.querySelector('#estimate-question-nav p');

    assert.match(progress.textContent, /1\/3/);

    f.dom.window.close();
  });

  await t.test('UI-15: Tải lại có thể khôi phục bản nháp', async () => {
    const f = await setup();

    fillQuestion(f, 'q1', 12, 16, 14);

    const savedDraft = f.window.localStorage.getItem(
      f.window.__estimateTest.getEstimateDraftKey()
    );

    assert.ok(savedDraft);

    // Mô phỏng tải lại dữ liệu đã lưu.
    const draft = JSON.parse(savedDraft);

    f.window.localStorage.setItem(
      f.window.__estimateTest.getEstimateDraftKey(),
      JSON.stringify({
        answers: draft.answers,
        currentIndex: 1
      })
    );

    await f.window.__estimateTest.loadEstimateQuestions();

    assert.equal(f.window.__estimateTest.currentIndex, 1);

    f.dom.window.close();
  });

  await t.test('UI-16: Không cho nộp khi dữ liệu sai', async () => {
    const f = await setup();

    fillQuestion(f, 'q1', 'abc', 16, 14);

    await f.window.__estimateTest.submitEstimateExam();

    assert.equal(f.postCount, 0);

    assert.ok(
      f.document.getElementById('estimate-validation-dialog')
    );

    f.dom.window.close();
  });

  await t.test('UI-17: Câu bỏ trống phải hiển thị lựa chọn', async () => {
    const f = await setup();

    await f.window.__estimateTest.submitEstimateExam();

    const dialog = f.document.getElementById(
      'estimate-validation-dialog'
    );

    assert.ok(dialog);
    assert.match(dialog.textContent, /chưa hoàn thành/);

    const buttons = dialog.querySelectorAll('button');
    assert.equal(buttons.length, 2);

    f.dom.window.close();
  });

  await t.test('UI-18: Nộp bài thành công hiển thị màn hình kết quả', async () => {
    const f = await setup();

    fillAllQuestions(f);

    await f.window.__estimateTest.submitEstimateExam();

    assert.equal(f.postCount, 1);

    assert.equal(
      f.document.getElementById('estimate-working-view')
        .classList.contains('hidden'),
      true
    );

    assert.equal(
      f.document.getElementById('estimate-result-view')
        .classList.contains('hidden'),
      false
    );

    assert.match(
      f.document.getElementById('estimate-feedback').textContent,
      /Kết quả luyện tập/
    );

    assert.equal(
      f.window.localStorage.getItem(
        f.window.__estimateTest.getEstimateDraftKey()
      ),
      null
    );

    f.dom.window.close();
  });

  await t.test('UI-19: API lỗi thì bản nháp không bị xóa', async () => {
    const f = await setup();

    fillAllQuestions(f);

    const draftKey = f.window.__estimateTest.getEstimateDraftKey();

    const originalDraft = f.window.localStorage.getItem(draftKey);

    f.postError = new Error('Lỗi máy chủ');

    await assert.rejects(
      f.window.__estimateTest.submitEstimateExam(),
      /Lỗi máy chủ/
    );

    assert.ok(f.window.localStorage.getItem(draftKey));
    assert.equal(f.window.localStorage.getItem(draftKey), originalDraft);

    f.dom.window.close();
  });

});
