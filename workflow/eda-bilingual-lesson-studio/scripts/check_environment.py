import argparse
import importlib.util
import json
import shutil
import sys
from pathlib import Path


def resolve_tool(explicit: str | None, command: str) -> str | None:
    if explicit:
        path = Path(explicit).expanduser().resolve()
        return str(path) if path.exists() else None
    return shutil.which(command)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Check tools used by the bilingual lesson workflow."
    )
    parser.add_argument("--ffmpeg")
    parser.add_argument("--node")
    parser.add_argument("--python")
    parser.add_argument("--node-modules")
    parser.add_argument("--presentation-skill")
    args = parser.parse_args()

    node_modules = (
        Path(args.node_modules).expanduser().resolve()
        if args.node_modules
        else None
    )
    presentation_skill = (
        Path(args.presentation_skill).expanduser().resolve()
        if args.presentation_skill
        else None
    )

    report = {
        "ffmpeg": resolve_tool(args.ffmpeg, "ffmpeg"),
        "node": resolve_tool(args.node, "node"),
        "python": (
            resolve_tool(args.python, "python")
            or resolve_tool(None, "python3")
            or sys.executable
        ),
        "edge_tts": importlib.util.find_spec("edge_tts") is not None,
        "artifact_tool": bool(
            node_modules and (node_modules / "@oai" / "artifact-tool").exists()
        ),
        "playwright": bool(
            node_modules and (node_modules / "playwright").exists()
        ),
        "presentation_finalizer": bool(
            presentation_skill
            and (
                presentation_skill
                / "container_tools"
                / "artifact_tool_utils.mjs"
            ).exists()
        ),
    }
    report["ready_for_full_package"] = all(
        report[key]
        for key in (
            "ffmpeg",
            "node",
            "python",
            "edge_tts",
            "artifact_tool",
            "playwright",
            "presentation_finalizer",
        )
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
