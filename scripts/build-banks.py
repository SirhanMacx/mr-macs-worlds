#!/usr/bin/env python3
"""Transform arcade question banks into slim JSON for Mr. Mac's Worlds.

Source (READ ONLY — never modified):
  arcade .../data/bank-fragments/all-subject-{global-9,ap-psychology}.json

Output (this repo):
  data/global9-bank.json
  data/appsych-bank.json

Each output: { course, label, version, topics:[topicName...], questions:[ {id,topic,prompt,choices[4],answer,explanation} ] }
Hard gate: AP Psych must contain NONE of the 2024-CED excluded content.
"""
import json, sys, collections, re

ARCADE = "/Volumes/CURRICULA/00_ACTIVE_CURRENT_PROJECTS/Review_Arcade/mr-macs-review-arcade-live/data/bank-fragments"
OUT = "/Users/mind_uploaded_crustacean/mr-macs-worlds/data"

# 2024 AP Psych CED EXCLUSIONS — these must NOT appear as testable content.
# NOTE: humanistic psychology (Rogers, person-centered therapy, "self-actualization"
# as a general humanistic concept) IS in scope. What is excluded is *Maslow's
# hierarchy of needs* as a testable taxonomy, Kohlberg's stages, Freud's
# psychosexual stages, Gardner's multiple intelligences, and the three named
# theories of emotion. The terms below are scoped to those exclusions only.
EXCLUDED = [
    "kohlberg",
    "maslow", "hierarchy of needs",
    "psychosexual", "oral stage", "anal stage", "phallic stage", "oedipus complex",
    "gardner", "multiple intelligence",
    "james-lange", "cannon-bard", "schachter-singer", "two-factor theory of emotion",
]

def slim(q, idx, course_slug):
    choices = q.get("choices", [])
    answer = q.get("correctText")
    # guarantee 4 choices and a valid answer present in choices
    if len(choices) != 4 or answer not in choices:
        return None
    return {
        "id": q.get("id") or f"{course_slug}-{idx:03d}",
        "topic": q.get("topic", "Review"),
        "prompt": q.get("prompt", "").strip(),
        "choices": choices,
        "answer": answer,
        "explanation": (q.get("explanation") or "").strip(),
    }

def build(src_name, course_slug, label):
    with open(f"{ARCADE}/{src_name}") as f:
        d = json.load(f)
    raw = d["questions"]
    out = []
    dropped = 0
    for i, q in enumerate(raw, 1):
        s = slim(q, i, course_slug)
        if s is None:
            dropped += 1
            continue
        out.append(s)
    topics = list(dict.fromkeys(q["topic"] for q in out))  # preserve order, unique
    bundle = {
        "course": course_slug,
        "label": label,
        "version": d.get("version", "unknown"),
        "source": "mr-macs-review-arcade shared question bank (copied, unmodified content)",
        "topics": topics,
        "questions": out,
    }
    return bundle, dropped

def scope_gate(bundle):
    """Return list of (excluded_term, question_id) hits."""
    hits = []
    for q in bundle["questions"]:
        blob = (q["prompt"] + " " + " ".join(q["choices"]) + " " + q["explanation"]).lower()
        for term in EXCLUDED:
            if term in blob:
                hits.append((term, q["id"]))
    return hits

def main():
    g9, g9_drop = build("all-subject-global-9.json", "global9", "Global History 9 (NYS Regents)")
    ap, ap_drop = build("all-subject-ap-psychology.json", "appsych", "AP Psychology (2024 CED)")

    # HARD GATE on AP Psych excluded content
    ap_hits = scope_gate(ap)
    g9_hits = scope_gate(g9)  # informational only for global

    with open(f"{OUT}/global9-bank.json", "w") as f:
        json.dump(g9, f, ensure_ascii=False, indent=1)
    with open(f"{OUT}/appsych-bank.json", "w") as f:
        json.dump(ap, f, ensure_ascii=False, indent=1)

    print(f"Global-9:  {len(g9['questions'])} questions across {len(g9['topics'])} topics (dropped {g9_drop} malformed)")
    print(f"AP-Psych:  {len(ap['questions'])} questions across {len(ap['topics'])} topics (dropped {ap_drop} malformed)")
    print(f"AP-Psych 2024-CED EXCLUDED-content hits: {len(ap_hits)}  {'<<< FAIL' if ap_hits else 'CLEAN'}")
    if ap_hits:
        for term, qid in ap_hits[:20]:
            print("   ", term, "->", qid)
        sys.exit(1)
    print("Wrote data/global9-bank.json + data/appsych-bank.json")

if __name__ == "__main__":
    main()
