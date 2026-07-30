#!/usr/bin/env python3
"""Risk-wording linter for GR Proposal / LoE / SOW drafts.

Rules are extracted from the internal "Government Relations Proposal and
Engagement Letter Guide" (sections 3, 4, 10, 13.2). This is a drafting-
assist tool, not a legal check -- flagged items still need human judgment.

Usage:
    python3 linter.py draft.txt
    python3 linter.py draft.docx --format json
    python3 linter.py draft.txt --rules custom_rules.yaml
"""
import argparse
import json
import re
import sys
from pathlib import Path

import yaml

SEVERITY_ORDER = {"high": 0, "medium": 1, "caution": 2}
SEVERITY_LABEL = {"high": "HIGH", "medium": "MEDIUM", "caution": "CAUTION"}

NEGATION_WORDS = {"not", "no", "never", "cannot", "can't", "won't", "doesn't", "don't", "without", "n't"}


def is_negated(para: str, match_start: int) -> bool:
    """True if one of the 4 words before the match is a negation (e.g. 'does not guarantee')."""
    preceding = re.findall(r"[\w']+", para[:match_start])[-4:]
    return any(w.lower() in NEGATION_WORDS for w in preceding)


def load_rules(rules_path: Path) -> dict:
    with open(rules_path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_paragraphs(input_path: Path) -> list[str]:
    suffix = input_path.suffix.lower()
    if suffix == ".docx":
        try:
            import docx  # python-docx
        except ImportError:
            sys.exit(
                "이 파일은 .docx입니다. python-docx가 설치되어 있지 않습니다.\n"
                "  pip install python-docx\n"
                "또는 텍스트로 저장한 뒤 .txt 파일로 다시 실행하세요."
            )
        document = docx.Document(str(input_path))
        return [p.text for p in document.paragraphs]
    return input_path.read_text(encoding="utf-8").splitlines()


def scan_paragraphs(paragraphs: list[str], rules: dict) -> list[dict]:
    findings = []
    all_pattern_rules = (rules.get("phrase_rules") or []) + (rules.get("keyword_rules") or [])
    for para_idx, para in enumerate(paragraphs, start=1):
        if not para.strip():
            continue
        for rule in all_pattern_rules:
            for m in re.finditer(rule["pattern"], para, flags=re.IGNORECASE):
                if is_negated(para, m.start()):
                    continue
                findings.append(
                    {
                        "paragraph": para_idx,
                        "rule_id": rule["id"],
                        "severity": rule["severity"],
                        "category": rule["category"],
                        "matched_text": m.group(0),
                        "context": para.strip(),
                        "issue": rule["issue"],
                        "suggestion": rule.get("suggestion"),
                        "guide_ref": rule.get("guide_ref"),
                    }
                )

        for word in rules.get("cap_watch_words") or []:
            for m in re.finditer(rf"\b{re.escape(word)}\b", para, flags=re.IGNORECASE):
                findings.append(
                    {
                        "paragraph": para_idx,
                        "rule_id": "CAP",
                        "severity": "medium",
                        "category": "지속 지원 cap 확인 필요",
                        "matched_text": m.group(0),
                        "context": para.strip(),
                        "issue": "이 표현 주변에 기간·투입시간·횟수 등 cap이 명시되어 있는지 확인 (3.3)",
                        "suggestion": None,
                        "guide_ref": "3.3",
                    }
                )
    findings.sort(key=lambda f: (f["paragraph"], SEVERITY_ORDER.get(f["severity"], 9)))
    return findings


def run_document_checks(full_text: str, rules: dict) -> list[dict]:
    results = []
    for check in rules.get("document_checks") or []:
        triggers = check.get("trigger_keywords")
        applicable = True
        if triggers:
            applicable = any(re.search(rf"\b{re.escape(kw)}", full_text, re.IGNORECASE) for kw in triggers)
        satisfied = bool(re.search(check["required_pattern"], full_text, re.IGNORECASE))
        results.append(
            {
                "id": check["id"],
                "description": check["description"],
                "guide_ref": check.get("guide_ref"),
                "applicable": applicable,
                "satisfied": satisfied,
            }
        )
    return results


def render_text_report(findings: list[dict], doc_checks: list[dict], source: str) -> str:
    lines = [f"# Risk Wording Report - {source}", ""]
    if not findings:
        lines.append("일치하는 위험 문구 없음.")
    else:
        counts = {}
        for f in findings:
            counts[f["severity"]] = counts.get(f["severity"], 0) + 1
        summary = ", ".join(f"{SEVERITY_LABEL[s]} {n}건" for s, n in sorted(counts.items(), key=lambda x: SEVERITY_ORDER[x[0]]))
        lines.append(f"총 {len(findings)}건 발견 ({summary})")
        lines.append("")
        for f in findings:
            lines.append(f"[{SEVERITY_LABEL[f['severity']]}] 문단 {f['paragraph']} - {f['category']} ({f['rule_id']}, {f['guide_ref']})")
            lines.append(f'  매칭: "{f["matched_text"]}"')
            lines.append(f"  문맥: {f['context']}")
            lines.append(f"  이슈: {f['issue']}")
            if f["suggestion"]:
                lines.append(f"  제안: {f['suggestion']}")
            lines.append("")

    lines.append("## 문서 단위 체크리스트 (13.2 기반, 해당 시)")
    for c in doc_checks:
        if not c["applicable"]:
            continue
        mark = "OK" if c["satisfied"] else "확인 필요"
        lines.append(f"  [{mark}] {c['description']} ({c['guide_ref']})")
    lines.append("")
    lines.append("주의: 이 결과는 초안 검토 보조용이며 최종 판단은 사람이 합니다.")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input", type=Path, help="검사할 초안 파일 (.txt, .md, .docx)")
    parser.add_argument("--rules", type=Path, default=Path(__file__).parent / "rules.yaml")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    args = parser.parse_args()

    if not args.input.exists():
        sys.exit(f"파일을 찾을 수 없습니다: {args.input}")

    rules = load_rules(args.rules)
    paragraphs = load_paragraphs(args.input)
    findings = scan_paragraphs(paragraphs, rules)
    doc_checks = run_document_checks("\n".join(paragraphs), rules)

    if args.format == "json":
        print(json.dumps({"findings": findings, "document_checks": doc_checks}, ensure_ascii=False, indent=2))
    else:
        print(render_text_report(findings, doc_checks, str(args.input)))


if __name__ == "__main__":
    main()
