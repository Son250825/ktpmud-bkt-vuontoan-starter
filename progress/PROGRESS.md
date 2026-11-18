# PROGRESS — NHÓM 24 — TRACK B

- Sản phẩm: Vườn Toán Lớp 3 — Ước lượng trước khi tính đúng
- Starter: `ktpmud-bkt-vuontoan-starter`
- Starter tag: `bkt-2026-v1`
- Nhóm: 24
- Fork: https://github.com/Son250825/ktpmud-bkt-vuontoan-starter.git

## PC-1 — 11/11/2026

### 1.1. Tiến độ theo acceptance criteria

Tại thời điểm PC-1, nhóm chủ yếu mới tiếp nhận đề bài, tìm hiểu cấu trúc starter và xác định hướng triển khai. Chưa hoàn thành chức năng ước lượng.

| Mã | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| B-01 | Chưa | Đã đọc yêu cầu Track B | Chưa tích hợp chức năng |
| B-02 | Chưa | Đã tìm hiểu dữ liệu câu hỏi hiện có | Chưa hoàn thiện dữ liệu |
| B-03 | Chưa | Đã nghiên cứu yêu cầu chấm điểm | Chưa triển khai logic |
| B-04 | Chưa | Đã tìm hiểu luồng API hiện có | Chưa triển khai |
| B-05 | Chưa | Đã tìm hiểu cơ sở dữ liệu | Chưa triển khai lưu trạng thái |
| B-06 | Chưa | Đã xác định yêu cầu phản hồi | Chưa triển khai |
| B-07 | Đang | Đã xác định phạm vi không được sửa | Cần bảo đảm tuân thủ trong quá trình phát triển |
| B-08 | Chưa | Chưa có bộ kiểm thử mới | Chưa triển khai |
| B-09 | Chưa | Chưa bổ sung script kiểm thử | Chưa triển khai |
| B-10 | Chưa | Chưa cấu hình CI | Chưa triển khai |
| B-11 | Đang | Đã tìm hiểu yêu cầu dữ liệu synthetic | Cần hoàn thiện kiểm tra bảo mật |
| B-12 | Chưa | Đã xác định yêu cầu giao diện | Chưa triển khai |

### 1.2. Sửa đổi bắt buộc từ Checkpoint 1

| Mục | Trạng thái | Bằng chứng |
|---|---|---|
| Chưa ghi nhận sửa đổi bắt buộc | - | Cập nhật nếu có yêu cầu mới từ giảng viên |

### 1.3. Kế hoạch ban đầu

| Công việc | Vai trò phụ trách | Dự kiến |
|---|---|---|
| Tìm hiểu cấu trúc starter và yêu cầu | Cả nhóm | PC-1 |
| Phân tích luồng xử lý câu hỏi và nộp bài | Lead-BE | Sau PC-1 |
| Thiết kế giao diện dạng bài ước lượng | Dev-FE | Sau PC-1 |
| Xây dựng kiểm thử | Dev-TEST | Sau PC-1 |
| Hoàn thiện tài liệu và kiểm thử | Cả nhóm | Trước Freeze |

### 1.4. Khó khăn và vướng mắc

- Nhóm chưa có nhiều kinh nghiệm với cấu trúc và luồng xử lý của dự án starter.
- Cần tìm hiểu cách tích hợp dạng câu hỏi mới mà không ảnh hưởng các dạng câu hỏi hiện có.
- Cần xác định cách lưu câu trả lời, chấm điểm và kiểm thử chức năng mới.

### 1.5. Câu hỏi cho giảng viên

Cập nhật khi phát sinh câu hỏi cần trao đổi với giảng viên.

### 1.6. Phân công

| Alias / vai trò | Đầu việc chính |
|---|---|
| Lead-BE | Phân tích backend, thiết kế và tích hợp logic xử lý |
| Dev-FE | Phát triển giao diện và luồng tương tác |
| Dev-TEST | Kiểm thử và hỗ trợ kiểm tra chất lượng |

---

## PC-2 — 18/11/2026

### 2.1. Tiến độ thực hiện so với PC-1

| Công việc | Kết quả thực tế | Trạng thái |
|---|---|---|
| Tìm hiểu starter và yêu cầu | Đã tìm hiểu cấu trúc dự án và luồng xử lý hiện có | Hoàn thành |
| Thiết kế chức năng ước lượng | Đã xây dựng các quyết định thiết kế trong `DECISIONS.md` | Hoàn thành |
| Xây dựng dữ liệu câu hỏi | Đã bổ sung 12 câu hỏi mẫu trong `data/seed.json` | Hoàn thành |
| Xây dựng backend | Đã triển khai `server/estimate.js` | Hoàn thành |
| Tích hợp API và cơ sở dữ liệu | Đã tích hợp chức năng vào luồng nộp bài hiện có | Hoàn thành |
| Xây dựng giao diện | Đã bổ sung luồng nhập khoảng ước lượng và kết quả chính xác | Hoàn thành |
| Kiểm thử | Đã có 52 test thành công, 0 test thất bại trên máy phát triển | Hoàn thành |
| Tài liệu | Đang hoàn thiện bộ hồ sơ submission | Đang thực hiện |
| Demo | Đã xây dựng kịch bản demo | Đang chuẩn bị |
| CI và Pull Request | Đã có cấu hình CI, cần xác nhận kết quả chạy trên GitHub | Đang thực hiện |

### 2.2. Tiến độ theo acceptance criteria

| Mã | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| B-01 | Đang | Giao diện và luồng bài tập ước lượng | Cần đối chiếu đầy đủ với acceptance criteria |
| B-02 | Xong | `data/seed.json` | Có 12 câu hỏi mẫu |
| B-03 | Xong | `server/estimate.js` | Có logic kiểm tra và chấm điểm |
| B-04 | Đang | `server/api.js` | Đã tích hợp API; cần rà soát đầy đủ yêu cầu bảo vệ đáp án |
| B-05 | Đang | `server/db.js`, `server/api.js` | Đã tích hợp lưu kết quả; cần đối chiếu đầy đủ tiêu chí |
| B-06 | Xong | `server/estimate.js`, giao diện bài tập | Có phân loại phản hồi cho kết quả ước lượng |
| B-07 | Đang | `server/api.js`, `server/auth.js` | Đã rà soát phạm vi sửa đổi; cần xác nhận lần cuối không vi phạm đề |
| B-08 | Xong | `tests/estimate.test.js`, `tests/estimate-api.test.js`, `tests/estimate-ui.test.js` | 52 test thành công, 0 thất bại |
| B-09 | Xong | `package.json` | Có script `npm test` |
| B-10 | Đang | `.github/workflows/ci.yml` | Đã cấu hình CI; chưa xác nhận run xanh trên GitHub |
| B-11 | Đang | `data/seed.json`, `SECURITY_PRIVACY_CHECKLIST.md` | Sử dụng dữ liệu mẫu; cần hoàn tất rà soát bảo mật |
| B-12 | Đang | `public/assets/js/pages/exercise.js` | Đã triển khai luồng nhập liệu bằng bàn phím; cần kiểm thử thủ công và đối chiếu tiêu chí |

### 2.3. Tình trạng hồ sơ submission

| Deliverable | Trạng thái | Đường dẫn |
|---|---|---|
| README.md | Đang rà soát | `submissions/vuontoan-nhom24/README.md` |
| REQUIREMENTS.md | Đã soạn | `submissions/vuontoan-nhom24/artifacts/REQUIREMENTS.md` |
| DECISIONS.md | Đã soạn | `submissions/vuontoan-nhom24/artifacts/DECISIONS.md` |
| TEST_REPORT.md | Đã soạn | `submissions/vuontoan-nhom24/artifacts/TEST_REPORT.md` |
| SECURITY_PRIVACY_CHECKLIST.md | Đã soạn | `submissions/vuontoan-nhom24/artifacts/SECURITY_PRIVACY_CHECKLIST.md` |
| AI_USE.md | Đã soạn | `submissions/vuontoan-nhom24/artifacts/AI_USE.md` |
| CONTRIBUTIONS.md | Đã soạn | `submissions/vuontoan-nhom24/artifacts/CONTRIBUTIONS.md` |
| DEMO_SCRIPT.md | Đã soạn | `submissions/vuontoan-nhom24/artifacts/DEMO_SCRIPT.md` |
| submission.json | Cần kiểm tra | `submissions/vuontoan-nhom24/submission.json` |
| source-ref.json | Cần kiểm tra | `submissions/vuontoan-nhom24/source-ref.json` |

### 2.4. Công việc còn lại

| Công việc | Phụ trách | Trạng thái |
|---|---|---|
| Rà soát nội dung và cấu trúc submission | Cả nhóm | Đang thực hiện |
| Kiểm tra `submission.json` và `source-ref.json` | Lead-BE | Chưa hoàn thành |
| Rà soát B-07 | Lead-BE | Cần xác nhận lần cuối |
| Kiểm thử thủ công giao diện | Dev-FE | Cần hoàn thành |
| Kiểm tra CI trên GitHub | Lead-BE | Chưa xác nhận |
| Hoàn thiện bằng chứng đóng góp và AI | Cả nhóm | Đang thực hiện |
| Kiểm tra và cập nhật thông tin commit | Lead-BE | Chưa hoàn thành |
| Hoàn thiện demo | Cả nhóm | Đang chuẩn bị |
| Commit, push và cập nhật Pull Request | Lead-BE | Chưa hoàn thành |

### 2.5. Khó khăn và rủi ro

- Thời gian triển khai và hoàn thiện tài liệu tương đối gấp.
- Cần bảo đảm chức năng mới không ảnh hưởng các dạng câu hỏi cũ.
- Cần kiểm tra đầy đủ các yêu cầu bảo mật và phạm vi không được sửa.
- CI trên GitHub và quy trình Pull Request cần được xác nhận thực tế.

### 2.6. Phân công

| Alias / vai trò | Đầu việc chính |
|---|---|
| Lead-BE | Backend, API, cơ sở dữ liệu, tích hợp và hoàn thiện submission |
| Dev-FE | Giao diện, tương tác và kiểm thử thủ công |
| Dev-TEST | Kiểm thử, rà soát yêu cầu và tài liệu |

---

## Kết quả cuối — Freeze 19/11/2026

- Final commit SHA: Cập nhật sau khi freeze.
- Release tag: bkt-2026-N24-rc1
- CI run URL: Cập nhật sau khi có kết quả chạy thành công.
- Trạng thái cuối các acceptance criteria: Cập nhật sau khi rà soát.
- Các công việc chưa hoàn thành và lý do: Cập nhật tại thời điểm freeze.