# Proposal Risk-Wording Linter

GR 컨설팅 Proposal / Letter of Engagement / SOW 초안에서, 내부 가이드
("Government Relations Proposal and Engagement Letter Guide")가 지적하는
위험 문구(결과 확보 의무, 무제한 지속 지원, 산출물 불명확 등)를 스캔하는
CLI 도구다.

**이 도구는 법률 검토를 대체하지 않는다.** 초안 단계에서 흔한 워딩 실수를
빠르게 잡아내기 위한 보조 도구이며, 최종 판단은 사람이 한다.

## 왜 필요한가

가이드 3장/4장/10장/13.2는 실무에서 반복되는 위험 문구와 권장 대체안을
표로 정리해 두었다. 이 표를 매번 수동으로 대조하는 대신, 초안(.txt/.md/.docx)을
넣으면 해당 표 기준으로 자동 스캔한다.

## 사용법

```bash
pip install -r requirements.txt

# 텍스트/마크다운 초안
python3 linter.py samples/risky_draft.txt

# Word 파일 (.docx) - python-docx 필요
python3 linter.py draft.docx

# JSON 출력 (다른 도구/파이프라인 연계용)
python3 linter.py draft.txt --format json
```

## 무엇을 잡아내는가 (`rules.yaml`)

- **phrase_rules**: 10장 표에 있는 근-문자열 위험 문구 (예: `will hold four
  meetings`, `secure meetings`, `recruit government officials`) → 표에 있는
  권장 대체 문구를 그대로 제시
- **keyword_rules**: 3.4장/4장의 결과 확보 의무 동사(`secure`, `obtain`,
  `recruit`, `ensure`, `guarantee`)와 직접 대외활동 동사(`engage`, `liaise
  with`, `conduct outreach to`) — 부정문(`does not guarantee` 등)은 가이드가
  권장하는 안전 문구이므로 자동 제외
- **cap_watch_words**: 3.3장 — `ongoing`, `regular`, `as needed` 등은 기간/
  투입시간/횟수 cap이 함께 있어야 하므로, 등장할 때마다 위치를 표시해 수동
  확인을 유도 (규칙 자체가 "근처에 cap이 있는지"까지 판단하지는 않음)
- **document_checks**: 13.2 체크리스트 중 문서 전체 단위에서 검증 가능한
  3개 항목 (availability/confirmation 전제, 추가 업무 별도 합의 조항,
  참석 비보장 문구)

## 규칙 추가/수정

`rules.yaml`만 수정하면 된다. 코드 변경 불필요. 새 위험 문구가 반복적으로
발견되면 `phrase_rules`에, 일반적인 위험 동사면 `keyword_rules`에 추가한다.

## 샘플

- `samples/risky_draft.txt` — 가이드 10장의 위험 문구를 의도적으로 모아둔
  테스트용 초안 (22건 발견되어야 정상)
- `samples/clean_draft.txt` — 가이드 11장의 권장 표준 조항으로 작성한 초안
  (cap 확인 권고 1건만 남아야 정상)

## 알려진 한계

- 정규식 기반이므로 패러프레이즈(같은 의미의 다른 표현)는 못 잡는다.
- `cap_watch_words`는 "근처에 실제로 cap이 있는지"까지는 판단하지 못하고
  위치만 알려준다. 최종 확인은 사람이 한다.
- 현재 규칙은 영문 Proposal/LoE 워딩 기준이다. 다른 문서 유형(Monitoring
  report, Activity report 등)에는 이 리스크 워딩 규칙을 그대로 적용하지
  않는다 — 해당 문서군은 별도 QC 관점(정확성/팩트체크)이 필요하다.
