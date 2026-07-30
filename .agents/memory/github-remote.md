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
git add -A
git commit -m "your message"
git push origin main
```

**Why:** Token is embedded in the origin URL so all git operations authenticate automatically without needing to re-supply credentials.

**How to apply:** After every significant completed task, run the three commands above to keep the repository in sync.
