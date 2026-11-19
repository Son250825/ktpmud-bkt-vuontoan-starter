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

### 1. Thông tin phiên bản đóng băng

| Nội dung | Giá trị |
|---|---|
| Nhóm | N24 |
| Track | B — Vườn Toán Lớp 3 |
| Sản phẩm | Vườn Toán Lớp 3 — Ước lượng trước khi tính đúng |
| Starter repository | `fossbk-spec/ktpmud-bkt-vuontoan-starter` |
| Starter commit | `aca3ea934fadc02251c761443405546c7bc02fc7` |
| Fork repository | `https://github.com/Son250825/ktpmud-bkt-vuontoan-starter` |
| Commit mã nguồn trước khi cập nhật PROGRESS.md | `0449f863a07227e30c8584826916b62cd5d48a8d` |
| Commit cuối cùng của phiên bản nộp bài | Sẽ cập nhật sau khi commit `PROGRESS.md` |
| Release tag | Sẽ tạo sau khi chốt commit cuối cùng |
| CI trên fork | [GitHub Actions](https://github.com/Son250825/ktpmud-bkt-vuontoan-starter/actions/runs/44500535573) |
| Ngày Freeze | 19/11/2026 |

### 2. Trạng thái Acceptance Criteria tại Freeze

| Mã | Trạng thái | Bằng chứng |
|---|---|---|
| B-01 | Xong | Luồng tính năng được tích hợp vào giao diện bài tập; mã nguồn tại `public/assets/js/pages/exercise.js` |
| B-02 | Xong | 12 câu hỏi mẫu trong `data/seed.json` |
| B-03 | Xong | Logic ước lượng và kiểm tra kết quả tại `server/estimate.js` |
| B-04 | Xong | Logic xử lý và chấm kết quả phía server tại `server/estimate.js`, `server/api.js` |
| B-05 | Xong | Lưu kết quả và khôi phục sau khi tải lại trang; có kiểm thử API và giao diện |
| B-06 | Xong | Phản hồi riêng cho phần ước lượng và phần tính chính xác |
| B-07 | Xong | Phạm vi sửa đổi được giới hạn theo quyết định; các thành phần xác thực ngoài phạm vi không được chủ động sửa đổi |
| B-08 | Xong | `tests/estimate.test.js`, `tests/estimate-api.test.js`, `tests/estimate-ui.test.js` |
| B-09 | Xong | Lệnh kiểm thử tự động `npm test` trong `package.json` |
| B-10 | Xong | Workflow CI tại `.github/workflows/ci.yml`; CI trên fork chạy thành công |
| B-11 | Xong | Dữ liệu mẫu và `SECURITY_PRIVACY_CHECKLIST.md` trong phạm vi tính năng |
| B-12 | Xong | Kiểm tra tương tác bàn phím, chuyển bước bằng Enter, thông báo lỗi và trạng thái giao diện được ghi trong `TEST_REPORT.md` |

### 3. Kết quả kiểm thử tại Freeze

| Nhóm kiểm thử | Số lượng |
|---|---:|
| Unit tests | 22 |
| API tests | 9 |
| UI tests | 19 |
| Tổng số test thực tế | 50 |
| Kết quả Node.js test runner báo cáo | 52 thành công, 0 thất bại |

Hai kết quả chênh lệch là các nhóm test cha được Node.js test runner tính vào kết quả tổng hợp.

Môi trường kiểm thử:
- Hệ điều hành: Windows.
- Node.js: 22.23.5.
- npm: 10.9.9.
- Cơ sở dữ liệu: SQLite.

Kết quả được ghi tại `submissions/hoang_mai_toan_24/artifacts/TEST_REPORT.md`.

### 4. Công việc chưa hoàn thành tại thời điểm Freeze

| Công việc | Trạng thái | Lý do |
|---|---|---|
| Kiểm thử xâm nhập chuyên sâu | Chưa thực hiện | Thời gian Hackathon tập trung vào phát triển và kiểm thử chức năng; nhóm chưa có điều kiện thực hiện đánh giá bảo mật chuyên sâu |
| Kiểm thử trên nhiều thiết bị và trình duyệt | Chưa hoàn thành đầy đủ | Nhóm chủ yếu kiểm thử trong môi trường Windows hiện có, chưa đủ điều kiện kiểm tra toàn diện các cấu hình khác |
| Kiểm thử tải và hiệu năng ở quy mô lớn | Chưa thực hiện | Chưa triển khai kiểm thử tải chuyên biệt nên chưa đưa ra kết luận về khả năng chịu tải thực tế |
| Quét toàn bộ lịch sử Git để tìm thông tin nhạy cảm | Chưa hoàn thành | Nhóm đã rà soát các tệp và cấu hình trong phạm vi kiểm tra nhưng chưa thực hiện quét chuyên biệt trên toàn bộ lịch sử commit |
| Kiểm tra độc lập toàn bộ thành phần ngoài phạm vi sửa đổi | Chưa thực hiện đầy đủ | Các thành phần xác thực và quản lý giáo viên thuộc starter, nằm ngoài phạm vi phát triển của Track B |
| Bằng chứng đóng góp độc lập của từng thành viên | Chưa đầy đủ | Lịch sử commit và review chưa thể hiện đầy đủ đóng góp độc lập của từng thành viên; các vai trò trong `CONTRIBUTIONS.md` mô tả phạm vi công việc, không thay thế bằng chứng commit/review thực tế |

Các nội dung trên được ghi nhận là giới hạn hoặc công việc chưa hoàn thành của phiên bản đóng băng. Nhóm không tuyên bố đã thực hiện những kiểm thử hoặc hoạt động chưa có bằng chứng.

### 5. Trạng thái bộ hồ sơ nộp bài

| Tài liệu | Trạng thái |
|---|---|
| `README.md` | Hoàn thành |
| `source-ref.json` | Đã có, sẽ cập nhật SHA cuối và release tag sau khi chốt commit |
| `submission.json` | Hoàn thành |
| `artifacts/AI_USE.md` | Hoàn thành |
| `artifacts/CONTRIBUTIONS.md` | Hoàn thành |
| `artifacts/DECISIONS.md` | Hoàn thành |
| `artifacts/REQUIREMENTS.md` | Hoàn thành |
| `artifacts/SECURITY_PRIVACY_CHECKLIST.md` | Hoàn thành |
| `artifacts/TEST_REPORT.md` | Hoàn thành |
| `slides/DEMO_SCRIPT.md` | Hoàn thành |
| `progress/PROGRESS.md` | Đang hoàn thiện trước khi commit cuối |

### 6. Kết luận Freeze

Tại thời điểm 19/11/2026, nhóm đã hoàn thành phần phát triển tính năng, kiểm thử và các tài liệu chính của Track B. Mã nguồn trước khi cập nhật báo cáo đã được ghi nhận tại commit `0449f863a07227e30c8584826916b62cd5d48a8d`.

Nhóm đang hoàn thiện báo cáo tiến độ để đưa vào bộ hồ sơ cuối cùng. Commit cuối cùng và release tag sẽ được xác định sau khi cập nhật và commit báo cáo này.

Các giới hạn kiểm thử và công việc chưa hoàn thành đã được ghi nhận rõ ràng. Sau khi chốt hồ sơ, nhóm chuyển sang quy trình nộp bài chính thức theo hướng dẫn của Ban tổ chức.