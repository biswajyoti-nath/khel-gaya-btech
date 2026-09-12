#!/usr/bin/env python3
"""
KHEL GAYA B.TECH GAMIFICATION & SYLLABUS ENGINE
Interactive CLI for transforming college syllabus topics into active-recall gamified study packs.
Supports multi-subject hierarchy: Subject -> Module -> Topic.
"""

import os
import sys
import json
import re
import argparse
import subprocess

CURRICULUM_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "curriculum.json")
PDF_PATH = "/home/biswajyoti-nath/Desktop/College/5thSEM/B.Tech-CSE-5th-Sem-Final.pdf"

def load_curriculum():
    if os.path.exists(CURRICULUM_FILE):
        try:
            with open(CURRICULUM_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading curriculum.json: {e}", file=sys.stderr)
    return {"subjects": []}

def save_curriculum(curriculum):
    with open(CURRICULUM_FILE, "w", encoding="utf-8") as f:
        json.dump(curriculum, f, indent=2)
    print(f"[OK] Saved updated curriculum to {CURRICULUM_FILE}")

def gamify_topic(title, category="Core", raw_notes=""):
    """
    Transforms a raw syllabus topic into the standardized Khel Gaya B.Tech gamified format.
    """
    slug = re.sub(r'[^a-zA-Z0-9]+', '_', title.lower()).strip('_')
    
    plain = f"Core intuition for {title}: Visualizing how it operates in simple terms without textbook jargon. {raw_notes}".strip()
    definition = f"{title} is formally defined in university curricula as a critical foundational concept. It establishes the theoretical boundaries, mechanisms, and operational requirements necessary for system correctness and performance."
    exam_takeaway = f"Key Exam Punchline: Master the definition, state the mathematical/architectural mechanism, and connect {title} to concrete real-world systems."
    trap = f"Exam Pitfall: Confusing {title} with related surface-level concepts or missing the required academic keywords in ASTU 5-mark and 10-mark questions."
    example = f"Practical Scenario: Real-world implementation or failure mode illustrating {title} in enterprise computing."
    q = f"In university examinations, what is the core operational principle and significance of {title}?"
    a = f"{title} addresses this by ensuring formal compliance with system specifications and providing deterministic guarantees."

    # Generate MCQ
    quiz_item = {
        "q": f"Which of the following statements most accurately captures the primary purpose of {title}?",
        "opts": [
            f"It provides the formal mechanism and architecture for {title}",
            "It is purely an optional aesthetic feature with no performance impact",
            "It eliminates the need for all underlying hardware layers",
            "It violates security and operating system isolation principles"
        ],
        "ans": 0,
        "cat": category,
        "correctFb": f"Correct! {title} is designed specifically to fulfill its formal architectural and operational requirements.",
        "distractors": [
            "Option B is incorrect: It is a critical functional requirement.",
            "Option C is incorrect: It relies directly on hardware and system primitives.",
            "Option D is incorrect: It adheres to strict isolation and design principles."
        ]
    }

    topic = {
        "id": slug,
        "cat": category,
        "title": title.upper(),
        "sub": f"{category} • University Syllabus",
        "plain": plain,
        "def": definition,
        "exam": exam_takeaway,
        "trap": trap,
        "example": example,
        "q": q,
        "a": a
    }

    return topic, quiz_item

def list_curriculum(curriculum):
    print("=" * 65)
    print("KHEL GAYA B.TECH MULTI-SUBJECT CURRICULUM HIERARCHY")
    print("=" * 65)
    for s_idx, subj in enumerate(curriculum.get("subjects", [])):
        print(f"\n[{s_idx + 1}] {subj.get('icon', '📚')} {subj.get('title')} ({subj.get('code')}) [ID: {subj.get('id')}]")
        for mod in subj.get("modules", []):
            t_count = len(mod.get("topics", []))
            q_count = len(mod.get("quiz", []))
            print(f"    └── Module {mod.get('num')}: {mod.get('title')} ({t_count} topics, {q_count} MCQs)")
            for t in mod.get("topics", []):
                print(f"        • [{t.get('cat')}] {t.get('title')}: {t.get('sub')}")

def add_topic_cli(subject_id, module_num, title, category="Core", notes=""):
    curriculum = load_curriculum()
    # Find subject
    subj = next((s for s in curriculum.get("subjects", []) if s.get("id") == subject_id), None)
    if not subj:
        print(f"Subject '{subject_id}' not found! Creating new subject...")
        subj = {
            "id": subject_id,
            "code": subject_id.upper(),
            "title": subject_id.replace("_", " ").title(),
            "icon": "📚",
            "modules": []
        }
        curriculum.setdefault("subjects", []).append(subj)

    # Find or create module
    mod = next((m for m in subj.get("modules", []) if m.get("num") == int(module_num)), None)
    if not mod:
        print(f"Module {module_num} not found in {subj['title']}! Creating module...")
        mod = {
            "id": f"m{module_num}",
            "num": int(module_num),
            "title": f"Module {module_num}",
            "topics": [],
            "quiz": []
        }
        subj.setdefault("modules", []).append(mod)

    # Gamify
    topic, quiz_item = gamify_topic(title, category, notes)
    mod.setdefault("topics", []).append(topic)
    mod.setdefault("quiz", []).append(quiz_item)
    save_curriculum(curriculum)
    print(f"[SUCCESS] Gamified and added '{title}' to {subj['title']} -> Module {module_num}!")

def interactive_mode():
    curriculum = load_curriculum()
    print("\n--- INTERACTIVE TOPIC GAMIFICATION ENGINE ---")
    subjects = curriculum.get("subjects", [])
    print("Available subjects:")
    for i, s in enumerate(subjects):
        print(f"  {i+1}. {s.get('title')} ({s.get('id')})")
    
    choice = input("\nChoose subject number (or type a new subject ID): ").strip()
    if choice.isdigit() and 1 <= int(choice) <= len(subjects):
        subj_id = subjects[int(choice) - 1]["id"]
    else:
        subj_id = choice.lower().replace(" ", "_")

    mod_num = input("Enter Module Number (1-5): ").strip() or "1"
    title = input("Enter Topic Title: ").strip()
    if not title:
        print("Topic title cannot be empty!")
        return

    cat = input("Enter Category [Core/Attacks/Architecture/Algorithms]: ").strip() or "Core"
    notes = input("Enter any notes / key details (or leave blank for auto-generation): ").strip()

    add_topic_cli(subj_id, mod_num, title, cat, notes)

def main():
    parser = argparse.ArgumentParser(description="Khel Gaya B.Tech Multi-Subject Gamification Engine")
    parser.add_argument("--list", action="store_true", help="List all subjects, modules, and topics")
    parser.add_argument("--interactive", action="store_true", help="Run interactive topic gamifier")
    parser.add_argument("--add", action="store_true", help="Add a new topic from flags")
    parser.add_argument("--subject", help="Subject ID (e.g. cyber, os, cn, ai, flat)")
    parser.add_argument("--module", type=int, help="Module number (1-5)")
    parser.add_argument("--title", help="Topic title to gamify")
    parser.add_argument("--category", default="Core", help="Topic category")
    parser.add_argument("--notes", default="", help="Optional notes")

    args = parser.parse_args()

    if args.list:
        curriculum = load_curriculum()
        list_curriculum(curriculum)
    elif args.interactive:
        interactive_mode()
    elif args.add and args.subject and args.module and args.title:
        add_topic_cli(args.subject, args.module, args.title, args.category, args.notes)
    else:
        curriculum = load_curriculum()
        list_curriculum(curriculum)
        print("\nTip: Run with --interactive to gamify and add new syllabus topics!")

if __name__ == "__main__":
    main()
