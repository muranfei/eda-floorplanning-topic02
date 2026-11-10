import argparse
import json
import shutil
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create a reusable bilingual lesson project skeleton."
    )
    parser.add_argument("--root", required=True, help="Project destination")
    parser.add_argument("--slug", required=True)
    parser.add_argument("--title-en", default="Lesson title")
    parser.add_argument("--title-zh", default="课程标题")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Reuse an existing folder and overwrite template files",
    )
    args = parser.parse_args()

    slug = args.slug.strip().lower().replace(" ", "-")
    if not slug or any(ch not in "abcdefghijklmnopqrstuvwxyz0123456789-_" for ch in slug):
        raise SystemExit("Slug must contain lowercase letters, digits, '-' or '_'")

    root = Path(args.root).expanduser().resolve()
    if root.exists() and any(root.iterdir()) and not args.force:
        raise SystemExit(f"Project directory is not empty: {root}")
    root.mkdir(parents=True, exist_ok=True)

    work = root / "work"
    outputs = root / "outputs"
    for path in (
        work / "voice",
        work / "frames",
        work / "video-build",
        work / "analysis",
        outputs / "downloads",
    ):
        path.mkdir(parents=True, exist_ok=True)

    web_target = outputs / f"{slug}_web"
    if web_target.exists():
        if not args.force:
            raise SystemExit(f"Web target already exists: {web_target}")
    shutil.copytree(
        SKILL_ROOT / "assets" / "web-template",
        web_target,
        dirs_exist_ok=args.force,
    )

    config_template = json.loads(
        (SKILL_ROOT / "assets" / "lesson-config.example.json").read_text(
            encoding="utf-8"
        )
    )
    config_template["slug"] = slug
    config_template["title"] = {
        "en": args.title_en,
        "zh": args.title_zh,
    }
    (work / "lesson-config.json").write_text(
        json.dumps(config_template, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    handoff = (SKILL_ROOT / "assets" / "handoff-template.md").read_text(
        encoding="utf-8"
    )
    (outputs / "HANDOFF.md").write_text(handoff, encoding="utf-8")

    print(
        json.dumps(
            {
                "project": str(root),
                "work": str(work),
                "outputs": str(outputs),
                "web": str(web_target),
                "next": [
                    "Fill work/lesson-config.json",
                    "Replace web-template topic copy and video paths",
                    "Build and validate video, web, and presentation",
                ],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
