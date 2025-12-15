# Node 24 Setup - Quick Reference

## ✅ Current Status

- **Node Version**: v24.11.1 ✅
- **Docker**: Uses Node 24 ✅ (configured in Dockerfiles)
- **Local**: Node 24 set as default ✅
- **Project**: .nvmrc files created ✅

---

## Why Node 24?

- **Next.js 16 requirement**: Requires Node >= 20.9.0, Node 24 is recommended
- **Docker consistency**: Docker containers use Node 24
- **Performance**: Node 24 has better performance and features

---

## Quick Commands

### Check Current Version
```bash
node --version
```

### Switch to Node 24
```bash
nvm use 24
```

### Set as Default
```bash
nvm alias default 24
```

### Auto-switch in Project Directory
The `.nvmrc` files will automatically switch to Node 24 when you `cd` into the project (if auto-switch hook is enabled).

---

## Making It Persistent

### Quick Fix (Recommended)

Run this script to add auto-switching:
```bash
cd /Users/adelsayed/Documents/Code/Stratagem
./scripts/fix-node-path.sh
source ~/.zshrc
```

### Manual Fix

Add to `~/.zshrc`:
```bash
# Auto-switch Node version based on .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"
  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version="$(nvm version "$(cat "${nvmrc_path}")")"
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

---

## Docker vs Local

- **Docker**: Always uses Node 24 (configured in Dockerfiles)
- **Local**: Should use Node 24 for consistency

When developing with Docker, your local Node version doesn't affect the containers, but it's good to match for:
- Running tests locally
- Installing packages
- Running dev server locally

---

## Troubleshooting

### Still showing Node 18?

1. **Check hardcoded PATH in ~/.zshrc**
   - Remove: `/Users/adelsayed/.nvm/versions/node/v18.20.8/bin`
   - Let nvm handle Node paths automatically

2. **Reload nvm**
   ```bash
   source ~/.nvm/nvm.sh
   nvm use 24
   ```

3. **Force reload shell**
   ```bash
   exec zsh
   ```

---

## Files Created

- `.nvmrc` - Project root
- `frontend/.nvmrc` - Frontend directory
- `backend/.nvmrc` - Backend directory
- `scripts/setup-node-24.sh` - Setup script
- `scripts/fix-node-path.sh` - Fix shell config

See `docs/NODE_24_SETUP_COMPLETE.md` for detailed information.
