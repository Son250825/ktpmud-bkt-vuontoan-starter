/* Logic trang Luyện Tập — tương tác giữ nguyên bản gốc; phần "Kiểm Tra Đáp Án"
 * được nối API: đáp án gửi lên server chấm (server không gửi đáp án xuống),
 * điểm + sao + tiến độ được lưu vào DB nên tải lại trang không mất. */
let activeInputId = 'math-input-3';
  let currentBrush = 'green';
  let hintCount = 2;
  // Xác định bộ bài đang được mở từ URL
const estimateSetId = 'uoc-luong-nhan-chia-6';
const isEstimateMode =
  new URLSearchParams(window.location.search).get('set') === estimateSetId;

let estimateQuestions = [];
// Lưu câu trả lời khi chuyển qua lại giữa các câu
let estimateAnswerCache = {};
let currentEstimateIndex = 0;
let estimateSubmissionErrors = [];
let estimateLastResult = null;

  function setActiveInput(id) {
    activeInputId = id;
    ['math-input-1', 'math-input-2', 'math-input-3'].forEach(name => {
      const el = document.getElementById(name);
      if (el) {
        if (name === id) {
          el.classList.add('ring-2', 'ring-tertiary-fixed-dim');
        } else {
          el.classList.remove('ring-2', 'ring-tertiary-fixed-dim');
        }
      }
    });
  }
  function showEstimateWarning(message, actions) {
  const oldDialog = document.getElementById('estimate-validation-dialog');
  if (oldDialog) oldDialog.remove();

  const overlay = document.createElement('div');
  overlay.id = 'estimate-validation-dialog';
  overlay.className =
    'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';

  const dialog = document.createElement('div');
  dialog.className =
    'w-full max-w-md rounded-2xl bg-white p-6 shadow-xl';

  const title = document.createElement('h2');
  title.className = 'mb-3 text-xl font-extrabold text-red-600';
  title.textContent = 'Chưa thể nộp bài';

  const content = document.createElement('p');
  content.className = 'mb-6 text-gray-700';
  content.textContent = message;

  const buttons = document.createElement('div');
  buttons.className = 'flex flex-wrap justify-end gap-3';

  actions.forEach(action => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    button.className = action.className;

    button.addEventListener('click', () => {
      overlay.remove();
      action.onClick();
    });

    buttons.appendChild(button);
  });

  dialog.append(title, content, buttons);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}

  function pressKey(val) {
    if (!activeInputId) return;
    const target = document.getElementById(activeInputId);
    if (!target) return;

    if (val === 'OK') {
      if (activeInputId === 'math-input-1') setActiveInput('math-input-2');
      else if (activeInputId === 'math-input-2') setActiveInput('math-input-3');
      return;
    }

    if (target.value === '?' || target.value === '') {
      target.value = val;
    } else if (target.value.length < 2) {
      target.value += val;
    }
  }

  function clearKey() {
    if (!activeInputId) return;
    const target = document.getElementById(activeInputId);
    if (target) {
      target.value = '';
    }
  }

  function setCompare(slotId, sign) {
    const el = document.getElementById(slotId);
    if (el) {
      el.textContent = sign;
      el.classList.add('bg-secondary-container', 'text-on-secondary-container', 'font-bold');
      el.classList.remove('text-primary');
    }
  }

  function selectBrush(color) {
    currentBrush = color;
    const btnGreen = document.getElementById('brush-green');
    const btnYellow = document.getElementById('brush-yellow');

    if (color === 'green') {
      btnGreen.classList.add('ring-2', 'ring-primary');
      btnYellow.classList.remove('ring-2', 'ring-primary');
    } else {
      btnYellow.classList.add('ring-2', 'ring-primary');
      btnGreen.classList.remove('ring-2', 'ring-primary');
    }
  }

  function paintCard(btn) {
    const statusLabel = btn.querySelector('span:nth-child(2)');
    if (currentBrush === 'green') {
      btn.className = "h-24 rounded-2xl bg-secondary-fixed-dim text-on-secondary-fixed p-3 flex flex-col items-center justify-center shadow-[0_4px_0_0_#006e2c] transition-transform active:scale-95 group";
      if (statusLabel) {
        statusLabel.textContent = "Đã tô Xanh lá (=12)";
        statusLabel.className = "text-[12px] font-label-sm text-secondary font-bold mt-1";
      }
    } else {
      btn.className = "h-24 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed p-3 flex flex-col items-center justify-center shadow-[0_4px_0_0_#e6a400] transition-transform active:scale-95 group";
      if (statusLabel) {
        statusLabel.textContent = "Đã tô Vàng (=18)";
        statusLabel.className = "text-[12px] font-label-sm text-tertiary font-bold mt-1";
      }
    }
  }

  function useHint() {
    if (hintCount > 0) {
      hintCount--;
      const btn = document.getElementById('btn-hint');
      if (btn) {
        btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">help_center</span><span>Xem gợi ý chi tiết (Còn ${hintCount} lần)</span>`;
      }
      alert("Ong Vàng mách nước: 36 : 6 nghĩa là mấy nhân với 6 bằng 36 nhỉ? Đúng rồi, 6 × 6 = 36!");
    } else {
      alert("Em đã dùng hết quyền trợ giúp trong lượt này. Hãy thử tự suy luận nhé!");
    }
  }

  function resetWorksheet() {
    ['slot-1-1', 'slot-1-2', 'slot-1-3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = '?';
        el.className = "w-12 h-12 rounded-2xl bg-surface-container-lowest text-primary flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] font-headline-lg";
      }
    });

    ['math-input-1', 'math-input-2', 'math-input-3'].forEach(id => {
      const inp = document.getElementById(id);
      if (inp) inp.value = '';
    });

    alert("Đã làm mới lại phiếu bài tập. Chúc bé luyện tập vui vẻ!");
  }

  /** Thu thập đáp án trên phiếu theo đúng id câu hỏi trong DB (data/seed.json). */
  function collectAnswers() {
    const answers = {};
    ['slot-1-1', 'slot-1-2', 'slot-1-3'].forEach((id, i) => {
      const el = document.getElementById(id);
      answers[`compare-${i + 1}`] = el && el.textContent.trim() !== '?' ? el.textContent.trim() : '';
    });
    ['math-input-1', 'math-input-2', 'math-input-3'].forEach((id, i) => {
      const el = document.getElementById(id);
      answers[`input-${i + 1}`] = el ? el.value.trim() : '';
    });
    document.querySelectorAll('button[onclick*="paintCard"]').forEach((btn, i) => {
      const label = btn.textContent;
      answers[`paint-${i + 1}`] = label.includes('Xanh') ? 'green' : label.includes('Vàng') ? 'yellow' : '';
    });
    return answers;
  }
// ===============================
// LUYỆN TẬP ƯỚC LƯỢNG
// ===============================

// Tạo giao diện cho một câu hỏi
function createEstimateQuestion(question, index) {
  const card = document.createElement('section');
  card.className =
    'bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-gray-200';

  const heading = document.createElement('h3');
  heading.className = 'text-lg font-extrabold text-primary mb-2';
  heading.textContent = `Câu ${index + 1}: ${question.prompt}`;

  const description = document.createElement('p');
  description.className = 'text-sm text-on-surface-variant mb-4';
  description.textContent =
    'Bước 1: Nhập cận dưới và cận trên. Bước 2: Nhập kết quả chính xác.';

  const fields = document.createElement('div');
fields.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 mt-5';

  const createField = (labelText, fieldName, disabled = false) => {
    const wrapper = document.createElement('label');
wrapper.className =
  'flex flex-col gap-3 rounded-2xl border-2 p-4 transition-all';

const styles = {
  lower: {
    box: 'border-blue-200 bg-blue-50',
    label: 'text-blue-800',
    input: 'border-blue-300 focus:ring-blue-400',
    icon: '↓'
  },
  upper: {
    box: 'border-violet-200 bg-violet-50',
    label: 'text-violet-800',
    input: 'border-violet-300 focus:ring-violet-400',
    icon: '↑'
  },
  exact: {
    box: 'border-green-200 bg-green-50',
    label: 'text-green-800',
    input: 'border-green-300 focus:ring-green-400',
    icon: '='
  }
};

const style = styles[fieldName];

wrapper.className += ` ${style.box}`;

const label = document.createElement('span');
label.className = `font-extrabold text-sm ${style.label}`;
label.textContent = `${style.icon} ${labelText}`;

const input = document.createElement('input');
input.type = 'text';
input.inputMode = 'decimal';
input.autocomplete = 'off';
input.disabled = disabled;
input.required = true;
input.dataset.questionId = question.id;
input.dataset.field = fieldName;
input.id = `estimate-${fieldName}-${question.id}`;

input.className =
  `w-full min-w-0 rounded-xl border-2 ${style.input} bg-white p-3 text-center text-xl font-extrabold focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-400`;

input.placeholder = 'Nhập số';

const error = document.createElement('span');
error.className = 'hidden text-sm font-semibold text-red-600';
error.dataset.errorFor = fieldName;

wrapper.append(label, input, error);

return { wrapper, input, error };
  };

  const lower = createField('① Cận dưới', 'lower');
  const upper = createField('② Cận trên', 'upper');
 const exact = createField('Kết quả chính xác', 'exact', true);

exact.wrapper.classList.add('hidden');

const exactStatus = document.createElement('p');
exactStatus.className = 'mt-2 text-sm font-semibold text-red-600';
exactStatus.setAttribute('role', 'status');
exactStatus.setAttribute('aria-live', 'polite');

  const status = document.createElement('p');
  status.className =
  'mt-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-base font-extrabold text-blue-800';

status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');

status.textContent =
  '✏️ Hãy nhập đủ CẬN DƯỚI và CẬN TRÊN để tiếp tục nhé!';

  let hasInteracted = false;


function validateRange() {
  const L = lower.input.value.trim();
  const U = upper.input.value.trim();

  let valid = false;
  let message = '';

  const isNaturalNumber = value => /^\d+$/.test(value);

  if (L !== '' && !isNaturalNumber(L)) {
    message = 'Cận dưới không hợp lệ, em chỉ được nhập số tự nhiên (0, 1, 2, 3, ...).';
  } else if (U !== '' && !isNaturalNumber(U)) {
    message = 'Cận trên không hợp lệ, em chỉ được nhập số tự nhiên (0, 1, 2, 3, ...).';
  } else if (L === '' && U === '') {
    message = 'Em hãy nhập cả cận dưới và cận trên.';
  } else if (L === '') {
    message = 'Em chưa nhập cận dưới.';
  } else if (U === '') {
    message = 'Em chưa nhập cận trên.';
  } else {
    const lowerNumber = Number(L);
    const upperNumber = Number(U);

    if (!Number.isSafeInteger(lowerNumber) || !Number.isSafeInteger(upperNumber)) {
      message = 'Cận dưới hoặc cận trên không hợp lệ, em chỉ được nhập số tự nhiên.';
    } else if (lowerNumber === upperNumber) {
      message = 'Hai cận đang bằng nhau. Cận dưới phải nhỏ hơn cận trên.';
    } else if (lowerNumber > upperNumber) {
      message = 'Cận dưới đang lớn hơn cận trên. Em hãy kiểm tra lại nhé.';
    } else {
      valid = true;
      message = 'Hai cận đã hợp lệ. Em có thể nhập kết quả chính xác.';
    }
  }

  exact.input.disabled = !valid;
  exact.wrapper.classList.toggle('hidden', !valid);

  lower.input.setAttribute(
  'aria-invalid',
  L !== '' &&
  (!isNaturalNumber(L) || !Number.isSafeInteger(Number(L)))
    ? 'true'
    : 'false'
);

upper.input.setAttribute(
  'aria-invalid',
  U !== '' &&
  (!isNaturalNumber(U) || !Number.isSafeInteger(Number(U)))
    ? 'true'
    : 'false'
);

  if (valid) {
    status.className = 'mt-3 text-sm font-semibold text-green-700';
  } else {
    status.className = 'mt-3 text-sm font-semibold text-red-600';
  }

  if (hasInteracted || valid) {
    status.textContent = message;
  }

  return valid;
}
let exactHasInteracted = false;

function validateExact() {
  const value = exact.input.value.trim();
  const isNaturalNumber = /^\d+$/.test(value);

  let valid = false;
  let message = '';

  if (value === '') {
    message = 'Em chưa nhập kết quả chính xác.';
  } else if (!isNaturalNumber) {
    message = 'Đáp án không hợp lệ. Em chỉ được nhập số tự nhiên (0, 1, 2, 3, ...).';
  } else if (!Number.isSafeInteger(Number(value))) {
    message = 'Số em nhập quá lớn. Hãy nhập một số tự nhiên hợp lệ.';
  } else {
    valid = true;
    message = 'Đáp án hợp lệ!';
  }

  exact.input.setAttribute(
    'aria-invalid',
    valid ? 'false' : 'true'
  );

  exactStatus.className = valid
    ? 'mt-2 text-sm font-semibold text-green-700'
    : 'mt-2 text-sm font-semibold text-red-600';

  if (exactHasInteracted || valid) {
    exactStatus.textContent = message;
  }

  return valid;
}

  function handleRangeInput() {
    hasInteracted = true;
    validateRange();
  }
exact.input.addEventListener('input', () => {
  exactHasInteracted = true;
  validateExact();
});

exact.input.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    exactHasInteracted = true;
    validateExact();
  }
});

exact.input.addEventListener('blur', () => {
  if (exact.input.value.trim() !== '') {
    exactHasInteracted = true;
    validateExact();
  }
});
  [lower.input, upper.input].forEach(input => {
  input.addEventListener('input', handleRangeInput);

  input.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;

  event.preventDefault();
  hasInteracted = true;

  const isValid = validateRange();

  // Enter ở cận dưới: chuyển sang cận trên
  if (input === lower.input) {
    upper.input.focus();
    return;
  }

  // Enter ở cận trên: chỉ chuyển sang kết quả nếu hai cận hợp lệ
  if (input === upper.input && isValid) {
    exact.input.focus();
  }
});

  input.addEventListener('blur', () => {
    if (input.value.trim() !== '') {
      hasInteracted = true;
      validateRange();
    }
  });
});

  fields.append(
    lower.wrapper,
    upper.wrapper,
    exact.wrapper
  );

  card.append(heading, description, fields, status, exactStatus);

  return card;
}
function goToFirstEstimateError() {
  if (estimateSubmissionErrors.length === 0) return;

  const firstError = estimateSubmissionErrors[0];

  const index = estimateQuestions.findIndex(
    question => question.id === firstError.questionId
  );

  if (index === -1) return;

  // Chuyển đến câu có lỗi
  currentEstimateIndex = index;

  // Hiển thị câu đó
  renderCurrentEstimateQuestion();

  // Đưa con trỏ đến ô sai đầu tiên
  const input = document.getElementById(
    `estimate-${firstError.field}-${firstError.questionId}`
  );

  if (input) {
    input.focus();
    input.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}
function goToFirstEstimateMissing(missing) {
  if (!missing.length) return;

  const firstMissing = missing[0];

  const index = estimateQuestions.findIndex(
    question => question.id === firstMissing.questionId
  );

  if (index === -1) return;

  currentEstimateIndex = index;
  renderCurrentEstimateQuestion();

  const input = document.getElementById(
    `estimate-${firstMissing.field}-${firstMissing.questionId}`
  );

  if (input && !input.disabled) {
    input.focus();
    input.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}
function applyEstimateSubmissionErrors(card, question) {
  const questionErrors = estimateSubmissionErrors.filter(
    error => error.questionId === question.id
  );

  questionErrors.forEach(error => {
    const input = card.querySelector(
      `[data-field="${error.field}"]`
    );

    if (!input) return;

    const wrapper = input.closest('label');
    const errorMessage = wrapper.querySelector(
      `[data-error-for="${error.field}"]`
    );

    // Đánh dấu ô nhập màu đỏ
    wrapper.style.borderColor = '#dc2626';
    wrapper.style.backgroundColor = '#fef2f2';
    input.style.borderColor = '#dc2626';

    // Hiển thị thông báo lỗi
    if (errorMessage) {
      errorMessage.textContent = error.message;
      errorMessage.classList.remove('hidden');
    }

    input.setAttribute('aria-invalid', 'true');
  });
}
// Tạo khóa riêng cho bộ câu hỏi ước lượng
function getEstimateDraftKey() {
  return `estimate-draft-${estimateSetId}`;
}
function validateAllEstimateAnswers() {
  const errors = [];
  const missing = [];

  estimateQuestions.forEach(question => {
    const answer = estimateAnswerCache[question.id];

    ['lower', 'upper', 'exact'].forEach(field => {
      const value = answer[field].trim();

      if (value === '') {
        missing.push({
          questionId: question.id,
          field
        });
        return;
      }

      if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
        errors.push({
          questionId: question.id,
          field,
          message: 'Chỉ được nhập số tự nhiên hợp lệ.'
        });
      }
    });

    const lower = answer.lower.trim();
    const upper = answer.upper.trim();

    if (
      /^\d+$/.test(lower) &&
      /^\d+$/.test(upper) &&
      Number.isSafeInteger(Number(lower)) &&
      Number.isSafeInteger(Number(upper)) &&
      Number(lower) >= Number(upper)
    ) {
      errors.push({
        questionId: question.id,
        field: 'upper',
        message: 'Cận trên phải lớn hơn cận dưới.'
      });
    }
  });

  return { errors, missing };
}

// Lưu đáp án và vị trí câu đang làm
function saveEstimateDraft() {
  const draft = {
    answers: estimateAnswerCache,
    currentIndex: currentEstimateIndex
  };

  localStorage.setItem(
    getEstimateDraftKey(),
    JSON.stringify(draft)
  );
}

// Đọc bản nháp đã lưu
function loadEstimateDraft() {
  try {
    const saved = localStorage.getItem(getEstimateDraftKey());

    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Không thể đọc bản nháp:', error);
    return null;
  }
}
// Tải câu hỏi từ server
async function loadEstimateQuestions() {
  const estimateView = document.getElementById('estimate-exercise-view');
  const legacyView = document.getElementById('legacy-exercise-view');
  const questionList = document.getElementById('estimate-question-list');

  if (!estimateView || !legacyView || !questionList) {
    throw new Error('Không tìm thấy vùng hiển thị bài ước lượng trong HTML.');
  }

  estimateView.classList.remove('hidden');
  legacyView.classList.add('hidden');

  questionList.textContent = 'Đang tải câu hỏi...';

  const data = await window.MathAPI.get(
    `/api/question-sets/${estimateSetId}/questions`
  );

  estimateQuestions = data.questions || [];

  if (estimateQuestions.length === 0) {
    throw new Error('Bộ câu hỏi ước lượng hiện chưa có câu hỏi.');
  }

  // Đọc bản nháp trước để ưu tiên khôi phục bài đang làm
  const savedDraft = loadEstimateDraft();

  // Chỉ khôi phục kết quả cũ khi không có bản nháp
  if (!savedDraft) {
    let previousResult = null;

    try {
      previousResult = await window.MathAPI.get(
        `/api/submissions/latest/${estimateSetId}`
      );
    } catch (error) {
      // Chưa từng nộp bài thì tiếp tục làm bài bình thường
      if (error.message !== 'Chưa có kết quả bài làm.') {
        throw error;
      }
    }

    if (previousResult) {
      renderEstimateResult(previousResult);
      return;
    }
  }

  estimateAnswerCache = {};

  // Khởi tạo dữ liệu cho từng câu
  estimateQuestions.forEach(question => {
    const savedAnswer = savedDraft?.answers?.[question.id];

    estimateAnswerCache[question.id] = {
      lower: typeof savedAnswer?.lower === 'string' ? savedAnswer.lower : '',
      upper: typeof savedAnswer?.upper === 'string' ? savedAnswer.upper : '',
      exact: typeof savedAnswer?.exact === 'string' ? savedAnswer.exact : ''
    };
  });

  // Khôi phục vị trí câu hỏi
  const savedIndex = savedDraft?.currentIndex;

  currentEstimateIndex =
    Number.isInteger(savedIndex) &&
    savedIndex >= 0 &&
    savedIndex < estimateQuestions.length
      ? savedIndex
      : 0;

  renderEstimateQuestionNav();
  renderCurrentEstimateQuestion();
}
// Hiển thị lại kết quả bài ước lượng đã nộp
function renderEstimateResult(result) {
  estimateLastResult = result;

  const feedback = document.getElementById('estimate-feedback');
  const workingView = document.getElementById('estimate-working-view');
  const resultView = document.getElementById('estimate-result-view');
  const detailView = document.getElementById('estimate-detail-view');

  if (!feedback || !workingView || !resultView || !detailView) return;

  workingView.classList.add('hidden');
  detailView.classList.add('hidden');
  resultView.classList.remove('hidden');

  feedback.replaceChildren();
  feedback.classList.remove('hidden');

  const details = result.detail || [];

  const totalStars = details.reduce(
    (sum, item) => sum + (Number(item.earnedPoints) || 0),
    0
  );

  const maxStars = details.length * 5;

  const title = document.createElement('h2');
  title.className = 'text-2xl font-extrabold text-primary text-center mb-5';
  title.textContent = 'Kết quả luyện tập';

  const summaryBox = document.createElement('div');
  summaryBox.className =
    'rounded-2xl bg-yellow-50 border border-yellow-200 p-6 text-center';

  const starDisplay = document.createElement('div');
  starDisplay.className = 'text-5xl font-extrabold text-yellow-500';
  starDisplay.textContent = `★ ${totalStars}/${maxStars}`;

  const correctText = document.createElement('p');
  correctText.className = 'mt-4 text-lg font-bold text-gray-800';
  correctText.textContent =
    `Em hoàn toàn chính xác ${result.correctCount}/${result.totalCount} câu`;

  const savedText = document.createElement('p');
  savedText.className = 'mt-2 text-sm text-gray-600';
  savedText.textContent = 'Kết quả và tiến độ đã được lưu.';

  summaryBox.append(starDisplay, correctText, savedText);
  feedback.append(title, summaryBox);

  if (result.starsEarned > 0) {
    const bonus = document.createElement('p');
    bonus.className = 'text-center font-bold text-yellow-600 mt-4';
    bonus.textContent = `Em nhận thêm ${result.starsEarned} sao thưởng!`;
    feedback.appendChild(bonus);
  }
}
// Lưu câu đang hiển thị vào bộ nhớ tạm
function saveCurrentEstimateAnswer() {
  const question = estimateQuestions[currentEstimateIndex];
  if (!question) return;

  ['lower', 'upper', 'exact'].forEach(field => {
    const input = document.getElementById(
      `estimate-${field}-${question.id}`
    );

    if (input) {
      estimateAnswerCache[question.id][field] = input.value;
    }
  });

  saveEstimateDraft();
}
// Kiểm tra câu đã nhập đủ ba ô chưa
function isEstimateQuestionComplete(question) {
  const answer = estimateAnswerCache[question.id];
  if (!answer) return false;

  const L = Number(answer.lower);
  const U = Number(answer.upper);
  const exact = Number(answer.exact);

  return (
    answer.lower.trim() !== '' &&
    answer.upper.trim() !== '' &&
    answer.exact.trim() !== '' &&
    Number.isFinite(L) &&
    Number.isFinite(U) &&
    Number.isFinite(exact) &&
    L >= 0 &&
    L < U
  );
}

// Hiển thị thanh điều hướng câu hỏi
function renderEstimateQuestionNav() {
  const nav = document.getElementById('estimate-question-nav');
  if (!nav) return;

  nav.replaceChildren();

  const completed = estimateQuestions.filter(
    isEstimateQuestionComplete
  ).length;

  const header = document.createElement('div');
  header.className = 'w-full mb-3';

  const progressText = document.createElement('p');
  progressText.className = 'font-extrabold text-primary mb-2';
  progressText.textContent =
    `Tiến độ: ${completed}/${estimateQuestions.length} câu đã hoàn thành`;

  const progressTrack = document.createElement('div');
  progressTrack.className =
    'w-full h-2 rounded-full bg-gray-200 overflow-hidden';

  const progressBar = document.createElement('div');
  progressBar.className =
    'h-full rounded-full bg-green-500 transition-all';
  progressBar.style.width =
    `${completed / estimateQuestions.length * 100}%`;

  progressTrack.appendChild(progressBar);
  header.append(progressText, progressTrack);
  nav.appendChild(header);

  const buttons = document.createElement('div');
  buttons.className =
    'grid grid-cols-6 sm:grid-cols-12 gap-2 w-full';

  estimateQuestions.forEach((question, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(index + 1);
    button.className =
      'rounded-xl border-2 p-3 font-extrabold transition-all';

    const isCurrent = index === currentEstimateIndex;
    const isComplete = isEstimateQuestionComplete(question);

    if (isCurrent) {
      button.classList.add(
        'bg-blue-600',
        'text-white',
        'border-blue-600',
        'ring-2',
        'ring-blue-300'
      );
    } else if (isComplete) {
      button.classList.add(
        'bg-green-100',
        'text-green-800',
        'border-green-400'
      );
    } else {
      button.classList.add(
        'bg-white',
        'text-gray-600',
        'border-gray-300'
      );
    }

    button.setAttribute(
      'aria-label',
      `Câu ${index + 1}${isComplete ? ', đã hoàn thành' : ', chưa hoàn thành'}`
    );

    button.addEventListener('click', () => {
      saveCurrentEstimateAnswer();
      currentEstimateIndex = index;
      renderCurrentEstimateQuestion();
    });

    buttons.appendChild(button);
  });

  nav.appendChild(buttons);
}

// Hiển thị câu đang được chọn
function renderCurrentEstimateQuestion() {
  const questionList = document.getElementById('estimate-question-list');
  if (!questionList) return;

  const question = estimateQuestions[currentEstimateIndex];
  if (!question) return;

  const card = createEstimateQuestion(question, currentEstimateIndex);
applyEstimateSubmissionErrors(card, question);
  // Khôi phục dữ liệu đã nhập trước đó
  ['lower', 'upper', 'exact'].forEach(field => {
    const input = card.querySelector(
      `[data-field="${field}"]`
    );

    if (input) {
      input.value = estimateAnswerCache[question.id][field] || '';
    }
  });

  // Kiểm tra lại trạng thái mở khóa ô kết quả
  const lower = card.querySelector('[data-field="lower"]');
  const upper = card.querySelector('[data-field="upper"]');
  const exact = card.querySelector('[data-field="exact"]');

  const validRange =
    lower.value.trim() !== '' &&
    upper.value.trim() !== '' &&
    Number.isFinite(Number(lower.value)) &&
    Number.isFinite(Number(upper.value)) &&
    Number(lower.value) >= 0 &&
    Number(lower.value) < Number(upper.value);

  exact.disabled = !validRange;
  exact.closest('label').classList.toggle('hidden', !validRange);

  // Cập nhật bộ nhớ và trạng thái thanh điều hướng khi nhập
  card.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => {
    const field = input.dataset.field;
    // Xóa cảnh báo lỗi cũ của ô đang được sửa
estimateSubmissionErrors = estimateSubmissionErrors.filter(
  error => !(error.questionId === question.id && error.field === field)
);

const wrapper = input.closest('label');
const errorMessage = wrapper?.querySelector(
  `[data-error-for="${field}"]`
);

if (wrapper) {
  wrapper.style.removeProperty('border-color');
  wrapper.style.removeProperty('background-color');
}

input.style.removeProperty('border-color');

if (errorMessage) {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

    estimateAnswerCache[question.id][field] = input.value;

    saveEstimateDraft();
    renderEstimateQuestionNav();
  });
});
  const controls = document.createElement('div');
  controls.className =
    'flex items-center justify-between gap-3 mt-5';

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.textContent = '← Câu trước';
  previous.disabled = currentEstimateIndex === 0;
  previous.className =
    'rounded-xl border-2 border-gray-300 px-4 py-3 font-bold disabled:opacity-40';

  previous.addEventListener('click', () => {
    saveCurrentEstimateAnswer();
    currentEstimateIndex--;
    saveEstimateDraft();
    renderCurrentEstimateQuestion();
  });

  const next = document.createElement('button');
  next.type = 'button';
  next.textContent =
    currentEstimateIndex === estimateQuestions.length - 1
      ? 'Đã đến câu cuối'
      : 'Câu tiếp theo →';

  next.disabled =
    currentEstimateIndex === estimateQuestions.length - 1;

  next.className =
    'rounded-xl bg-blue-600 text-white px-4 py-3 font-bold disabled:opacity-40';

  next.addEventListener('click', () => {
    saveCurrentEstimateAnswer();
    currentEstimateIndex++;
    saveEstimateDraft();
    renderCurrentEstimateQuestion();
  });

  controls.append(previous, next);

  questionList.replaceChildren(card, controls);
  renderEstimateQuestionNav();
}

// Thu thập câu trả lời theo ID trong database
function collectEstimateAnswers() {
  saveCurrentEstimateAnswer();

  return JSON.parse(JSON.stringify(estimateAnswerCache));
}


function resetCurrentEstimateQuestion() {
  const question = estimateQuestions[currentEstimateIndex];
  if (!question) return;

  // Xóa dữ liệu trong bộ nhớ của câu hiện tại
  estimateAnswerCache[question.id] = {
    lower: '',
    upper: '',
    exact: ''
  };

  // Xóa trực tiếp nội dung các ô nhập
  const card = document.querySelector(
    '#estimate-question-list [data-field="lower"]'
  )?.closest('.estimate-question-card');

  const questionList = document.getElementById('estimate-question-list');
  const inputs = questionList.querySelectorAll(
    `[data-question-id="${question.id}"]`
  );

  inputs.forEach(input => {
    input.value = '';
    input.setAttribute('aria-invalid', 'false');
  });

  // Khóa lại ô kết quả chính xác
  const exact = questionList.querySelector(
    `[data-field="exact"][data-question-id="${question.id}"]`
  );

  if (exact) {
    exact.disabled = true;
    exact.closest('label')?.classList.add('hidden');
  }

  // Cập nhật thông báo
  const status = questionList.querySelector('[role="status"]');
  if (status) {
    status.textContent = 'Em hãy nhập cả cận dưới và cận trên.';
    status.className = 'mt-3 text-sm font-semibold text-red-600';
  }

  // Cập nhật trạng thái danh sách câu hỏi
  renderEstimateQuestionNav();
}

// Làm lại bộ câu hỏi ước lượng

function resetEstimateWorksheet() {
  // Xóa toàn bộ câu trả lời cũ
  estimateQuestions.forEach(question => {
    estimateAnswerCache[question.id] = {
      lower: '',
      upper: '',
      exact: ''
    };
  });

  // Xóa kết quả của lượt làm trước
  estimateLastResult = null;

  // Quay về câu hỏi đầu tiên
  currentEstimateIndex = 0;

  // Đặt lại các màn hình
  document.getElementById('estimate-working-view').classList.remove('hidden');
  document.getElementById('estimate-result-view').classList.add('hidden');
  document.getElementById('estimate-detail-view').classList.add('hidden');

  // Xóa nội dung kết quả cũ
  const feedback = document.getElementById('estimate-feedback');
  if (feedback) {
    feedback.classList.add('hidden');
    feedback.replaceChildren();
  }

  const detailList = document.getElementById('estimate-detail-list');
  if (detailList) {
    detailList.replaceChildren();
  }

  // Hiển thị lại câu hỏi đầu tiên
  renderEstimateQuestionNav();
  renderCurrentEstimateQuestion();

  // Đưa màn hình lên đầu
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Nộp bài ước lượng
async function submitEstimateExam() {
  const submittedAnswers = collectEstimateAnswers();

  const validation = validateAllEstimateAnswers();

  // Trường hợp có dữ liệu không hợp lệ
  if (validation.errors.length > 0) {
    estimateSubmissionErrors = validation.errors;

    showEstimateWarning(
      'Phát hiện dữ liệu không hợp lệ. Em hãy quay lại kiểm tra các ô được đánh dấu màu đỏ.',
      [
        {
          label: 'Quay lại kiểm tra',
          className: 'rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700',
          onClick: goToFirstEstimateError
        }
      ]
    );

    return;
  }

  // Không còn lỗi dữ liệu nhưng vẫn có ô bỏ trống
  estimateSubmissionErrors = [];

  if (validation.missing.length > 0) {
    showEstimateWarning(
      'Em vẫn còn câu hỏi chưa hoàn thành. Em muốn quay lại làm tiếp hay nộp bài luôn?',
      [
        {
          label: 'Quay lại bài tập',
          className: 'rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-700 hover:bg-gray-100',
          onClick: () => goToFirstEstimateMissing(validation.missing)
        },
        {
          label: 'Nộp bài',
          className: 'rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700',
          onClick: () => submitEstimateAnswers(submittedAnswers)
        }
      ]
    );

    return;
  }

  // Tất cả dữ liệu hợp lệ và đã điền đầy đủ
  await submitEstimateAnswers(submittedAnswers);
}
async function submitEstimateAnswers(submittedAnswers) {

const result = await window.MathAPI.post('/api/submissions', {
  setId: estimateSetId,
  answers: submittedAnswers,
  durationSec: Math.max(0, seconds - 342)
});

console.log('KẾT QUẢ NỘP BÀI:', result);

// Xóa bản nháp sau khi nộp bài thành công
localStorage.removeItem(getEstimateDraftKey());
  // Lưu kết quả để sử dụng ở màn hình tổng kết và chi tiết
  estimateLastResult = result;

    renderEstimateResult(result);
}
// Tự động cuộn đến bảng tổng kết sau khi nộp bài
function showEstimateDetails() {
  document.getElementById('estimate-result-view').classList.add('hidden');
  document.getElementById('estimate-working-view').classList.add('hidden');
  document.getElementById('estimate-detail-view').classList.remove('hidden');

  renderEstimateDetails();
}

function showEstimateSummary() {
  document.getElementById('estimate-detail-view').classList.add('hidden');
  document.getElementById('estimate-working-view').classList.add('hidden');
  document.getElementById('estimate-result-view').classList.remove('hidden');
}


function renderEstimateDetails() {
  const list = document.getElementById('estimate-detail-list');
  if (!list || !estimateLastResult) return;

  list.replaceChildren();

  // Lấy câu trả lời trực tiếp từ kết quả từng câu API trả về

  (estimateLastResult.detail || []).forEach((item, index) => {
    const row = document.createElement('div');
    row.className =
      'rounded-xl bg-surface-container-low p-4 border border-gray-200';

    const question = estimateQuestions.find(
      q => q.id === item.questionId
    );

    const answer = item.studentAnswer || {};

    const name = document.createElement('p');
    name.className = 'font-bold text-primary';
    name.textContent =
      `Câu ${index + 1}: ${question ? question.prompt : item.questionId}`;

    const earned = Math.max(
      0,
      Math.min(5, Number(item.earnedPoints) || 0)
    );

    const stars = document.createElement('p');
    stars.className = 'text-2xl text-yellow-500 mt-2';
    stars.textContent = '★'.repeat(earned) + '☆'.repeat(5 - earned);

    const answerBox = document.createElement('div');
    answerBox.className =
      'mt-3 rounded-lg bg-white p-3 space-y-2 text-sm';

    const lower = document.createElement('p');
    lower.textContent = `Cận dưới em nhập: ${answer.lower || 'Chưa nhập'}`;

    const upper = document.createElement('p');
    upper.textContent = `Cận trên em nhập: ${answer.upper || 'Chưa nhập'}`;

    const exact = document.createElement('p');
    exact.textContent = `Kết quả em nhập: ${answer.exact || 'Chưa nhập'}`;

    answerBox.append(lower, upper, exact);

    const estimateStatus = document.createElement('p');
    estimateStatus.className = 'text-sm mt-3';
    estimateStatus.textContent = item.estimateCorrect
      ? '✓ Khoảng ước lượng hợp lý'
      : '✗ Khoảng ước lượng chưa hợp lý';

    const exactStatus = document.createElement('p');
    exactStatus.className = 'text-sm mt-1';
    exactStatus.textContent = item.exactCorrect
      ? '✓ Kết quả chính xác đúng'
      : '✗ Kết quả chính xác chưa đúng';

    const feedback = document.createElement('p');
    feedback.className =
      'mt-3 rounded-lg bg-white p-3 text-sm text-gray-700';
    feedback.textContent = item.feedback || '';

    row.append(
      name,
      stars,
      answerBox,
      estimateStatus,
      exactStatus,
      feedback
    );

    list.appendChild(row);
  });
}

  async function submitExam() {
  const modal = document.getElementById('feedback-modal');
  try {
    // Nếu đang làm bài ước lượng thì dùng API chấm riêng
    if (isEstimateMode) {
      await submitEstimateExam();
      return;
    }

    // Bài cũ giữ nguyên cách nộp
    const result = await window.MathAPI.post('/api/submissions', {
        setId: 'phieu-bai-9-10', answers: collectAnswers(), durationSec: Math.max(0, seconds - 342),
      });
      if (modal) {
        const title = modal.querySelector('h4');
        const desc = modal.querySelector('p');
        if (title) title.textContent = result.scorePercent >= 80 ? 'Xuất sắc quá! 🎉' : result.scorePercent >= 50 ? 'Tốt lắm, cố thêm chút nữa nhé! 💪' : 'Mình cùng ôn lại rồi làm lại nhé! 🌱';
        if (desc) desc.innerHTML = `Em làm đúng <strong>${result.correctCount}/${result.totalCount}</strong> phần, đạt <strong>${result.scorePercent}%</strong>` +
          (result.starsEarned ? ` và nhận thêm <strong class="text-tertiary">+${result.starsEarned} Sao</strong> vàng!` : ' (điểm chưa cao hơn lần tốt nhất nên chưa cộng thêm sao).') +
          `<br/>Điểm đã được lưu vào hồ sơ học tập của em.`;
        modal.classList.remove('hidden');
      }
    } catch (err) {
      alert(err.message === 'Bạn chưa đăng nhập.' ? 'Phiên đăng nhập đã hết, em đăng nhập lại nhé!' : `Chưa nộp được bài: ${err.message}`);
      if (err.message === 'Bạn chưa đăng nhập.') location.href = 'login.html';
    }
  }

  function closeModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  // Gentle timer counter
  let seconds = 342;
  setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    const timerEl = document.getElementById('display-timer');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
  }, 1000);
  // Chỉ tải bộ câu hỏi mới khi URL có tham số set tương ứng
if (isEstimateMode) {
  loadEstimateQuestions().catch(err => {
    const questionList = document.getElementById('estimate-question-list');

    if (questionList) {
      questionList.textContent =
        `Không tải được câu hỏi: ${err.message}`;
    }
  });
}
