# 🚀 Quick Start: Create GitHub Issues for Governance Module

This guide helps you create GitHub issues from the task templates for remaining governance work.

## 1️⃣ Get Your GitHub Token

### Create Token (2 minutes)
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Classic"**
3. Enter name: `Stratagem Issues Creator`
4. Check: **`repo`** (full control of private repos)
5. Scroll down, click **"Generate token"**
6. **Copy** the token (starts with `ghp_`)

## 2️⃣ Set Environment Variable

```bash
# Open terminal and run:
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx

# Replace xxxxxxxxxxxxx with your actual token
```

## 3️⃣ Create Issues

```bash
cd /Users/adelsayed/Documents/Code/Stratagem

# Create ALL issues
node scripts/create-governance-issues.js

# OR create only critical P0 issues
node scripts/create-governance-issues.js --filter=p0

# OR create only P1 (should-have) issues
node scripts/create-governance-issues.js --filter=p1
```

## 📊 What Gets Created

### P0 Issues (5 Critical - Must Create First)
- [ ] Policy Hierarchy & Management (Story 2.1) - 13 points
- [ ] Unified Control Library (Story 3.1) - 13 points
- [ ] Asset-Control Integration (Story 5.1) - 8 points
- [ ] Compliance Posture Report (Story 6.1) - 13 points
- [ ] Critical Alerts & Escalations (Story 8.3) - 8 points

### P1 Issues (5 Should-Have Sample)
- [ ] Policy Exception Management (Story 2.4) - 13 points
- [ ] Control Testing Framework (Story 3.6) - 8 points
- [ ] Findings & Remediation Tracking (Story 6.7) - 13 points
- [ ] Role-Based Access Control (Story 7.4) - 13 points
- [ ] Bulk Operations & Automation (Story 8.5) - 8 points

### P2 Issues (2 Nice-to-Have Sample)
- [ ] Control Analytics & Dashboard (Story 3.15) - 13 points
- [ ] Continuous Monitoring (Story 6.9) - 13 points

**Total**: 12 sample issues (out of 34 remaining stories)

## ✅ Verify Success

After running the script, visit:
https://github.com/mohamedadel0806/Stratagem/issues

You should see new issues with labels like:
- `priority/p0`, `priority/p1`, `priority/p2`
- `epic/policy-management`, `epic/control-library`, etc.

## 🎯 Next Steps

1. **Create Project**: Organize issues into sprints
   ```bash
   gh project create "Governance Sprint 2"
   ```

2. **Assign Issues**: Click issue → Assignees → Select team member

3. **Add to Milestone**: 
   - Click issue → Milestone → "Sprint 2" (create if needed)

4. **Start Development**: Create feature branch
   ```bash
   git checkout -b feature/issue-123-policy-management
   ```

## 📖 Full Documentation

For detailed setup and troubleshooting:
- See: `/docs/GITHUB_ISSUES_CREATION_GUIDE.md`
- GitHub Docs: https://docs.github.com/en/issues

## 🆘 Troubleshooting

### "GITHUB_TOKEN not found"
```bash
# Set token for this session:
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
node scripts/create-governance-issues.js

# OR save to file:
echo "ghp_xxxxxxxxxxxxx" > ~/.github-token
chmod 600 ~/.github-token
```

### "Not Found" / "Insufficient Permissions"
- ✅ Token has `repo` scope checked
- ✅ Token is not expired (check: https://github.com/settings/tokens)
- ✅ Repository is: `mohamedadel0806/Stratagem`

### Issues not appearing
- Wait 10 seconds for GitHub to index
- Refresh the page
- Check labels: `priority/p0`, `epic/policy-management`

---

**Created**: Dec 19, 2025  
**Status**: Ready to use  
**Questions?** See GITHUB_ISSUES_CREATION_GUIDE.md
