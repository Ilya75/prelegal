import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/documents")

_APP_ROOT = Path(__file__).parents[4]
_CATALOG_PATH = _APP_ROOT / "catalog.json"
_TEMPLATES_DIR = _APP_ROOT / "templates"

# Cover page is a sub-component of the NDA, not a standalone document
_SKIP_SLUGS = {"mutual-nda-coverpage"}


def _filename_to_slug(filename: str) -> str:
    return Path(filename).stem.lower()


def _load_catalog() -> list[dict]:
    return json.loads(_CATALOG_PATH.read_text(encoding="utf-8"))


@router.get("")
def list_documents():
    catalog = _load_catalog()
    result = []
    for entry in catalog:
        slug = _filename_to_slug(entry["filename"])
        if slug not in _SKIP_SLUGS:
            result.append({
                "slug": slug,
                "name": entry["name"],
                "description": entry["description"],
                "filename": entry["filename"],
            })
    return result


@router.get("/{slug}/template")
def get_template(slug: str):
    catalog = _load_catalog()
    entry = next((e for e in catalog if _filename_to_slug(e["filename"]) == slug), None)
    if not entry:
        raise HTTPException(status_code=404, detail=f"Document not found: {slug}")
    template_path = _TEMPLATES_DIR / Path(entry["filename"]).name
    if not template_path.exists():
        raise HTTPException(status_code=404, detail=f"Template file not found: {entry['filename']}")
    return {"content": template_path.read_text(encoding="utf-8")}
