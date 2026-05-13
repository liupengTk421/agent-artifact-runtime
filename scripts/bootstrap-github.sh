#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${REPO_NAME:-agent-artifact-runtime}"
OWNER="${OWNER:-}"
VISIBILITY="--private"
if [[ "${PUBLIC:-0}" == "1" ]]; then
  VISIBILITY="--public"
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required: https://cli.github.com/" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Please run: gh auth login" >&2
  exit 1
fi

if [[ ! -d .git ]]; then
  git init
  git branch -M main
fi

git add .
if ! git diff --cached --quiet; then
  git commit -m "Initial agent artifact runtime scaffold"
fi

CREATE_ARGS=("$REPO_NAME" "$VISIBILITY" --source=. --remote=origin --push)
if [[ -n "$OWNER" ]]; then
  CREATE_ARGS=("$OWNER/$REPO_NAME" "$VISIBILITY" --source=. --remote=origin --push)
fi

if ! gh repo view "${OWNER:+$OWNER/}$REPO_NAME" >/dev/null 2>&1; then
  gh repo create "${CREATE_ARGS[@]}"
else
  git remote add origin "$(gh repo view "${OWNER:+$OWNER/}$REPO_NAME" --json sshUrl --jq .sshUrl)" 2>/dev/null || true
  git push -u origin main
fi

FULL_NAME="$(gh repo view "${OWNER:+$OWNER/}$REPO_NAME" --json nameWithOwner --jq .nameWithOwner)"
echo "Repository ready: $FULL_NAME"

# Labels
if [[ -f tasks/labels.json ]]; then
  node - <<'NODE' > /tmp/labels.tsv
const fs = require('fs');
const labels = JSON.parse(fs.readFileSync('tasks/labels.json', 'utf8'));
for (const l of labels) console.log([l.name, l.color, l.description || ''].join('\t'));
NODE
  while IFS=$'\t' read -r name color description; do
    gh label create "$name" --repo "$FULL_NAME" --color "$color" --description "$description" --force >/dev/null
  done < /tmp/labels.tsv
fi

# Milestones
for milestone in "M1 MVP" "M2 Runtime Hardening" "M3 Platform" "M4 Distribution"; do
  gh api -X POST "repos/$FULL_NAME/milestones" -f title="$milestone" >/dev/null 2>&1 || true
done

# Issues
if [[ -f tasks/issues.json ]]; then
  node - <<'NODE' > /tmp/issues.jsonl
const fs = require('fs');
const issues = JSON.parse(fs.readFileSync('tasks/issues.json', 'utf8'));
for (const issue of issues) console.log(JSON.stringify(issue));
NODE
  while IFS= read -r line; do
    title=$(node -e "const i=JSON.parse(process.argv[1]); console.log(i.title)" "$line")
    body=$(node -e "const i=JSON.parse(process.argv[1]); console.log(i.body)" "$line")
    labels=$(node -e "const i=JSON.parse(process.argv[1]); console.log((i.labels||[]).join(','))" "$line")
    milestone=""
    if [[ "$labels" == *"milestone:mvp"* ]]; then milestone="M1 MVP"; fi
    if [[ "$labels" == *"milestone:runtime-hardening"* ]]; then milestone="M2 Runtime Hardening"; fi
    if [[ "$labels" == *"milestone:platform"* ]]; then milestone="M3 Platform"; fi
    if [[ "$labels" == *"milestone:distribution"* ]]; then milestone="M4 Distribution"; fi
    if ! gh issue list --repo "$FULL_NAME" --search "$title in:title" --json title --jq '.[].title' | grep -Fxq "$title"; then
      if [[ -n "$milestone" ]]; then
        gh issue create --repo "$FULL_NAME" --title "$title" --body "$body" --label "$labels" --milestone "$milestone" >/dev/null
      else
        gh issue create --repo "$FULL_NAME" --title "$title" --body "$body" --label "$labels" >/dev/null
      fi
    fi
  done < /tmp/issues.jsonl
fi

echo "Labels, milestones, and issues configured."
