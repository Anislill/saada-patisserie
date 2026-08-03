---
name: GitHub remote setup
description: How the GitHub remote is configured for this project and how to push future changes.
---

# GitHub Remote Setup

**Repository:** https://github.com/Anislill/saada-patisserie  
**Branch:** main  
**Remote name:** origin

## How it works
The PAT token is embedded in the remote URL stored in `.git/config` (local only, never pushed). Git uses it automatically on every push — no extra credential step needed.

## Pushing future changes
```bash
cd /home/runner/workspace
git remote set-url origin "https://${GITHUB_PAT}@github.com/Anislill/saada-patisserie.git"
git add -A
git commit -m "your message"
git push origin main
```

**Why:** The PAT must be re-injected into the remote URL via the shell env var `$GITHUB_PAT` before pushing. The URL resets between sessions so always run `set-url` first.

**How to apply:** After every significant completed task, run the three commands above to keep the repository in sync.
