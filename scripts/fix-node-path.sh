#!/bin/bash

# Fix Node version path issue in shell profile
# This removes hardcoded Node paths and sets up auto-switching

echo "🔧 Fixing Node version configuration..."

SHELL_PROFILE=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
else
    echo "❌ Could not find shell profile file"
    exit 1
fi

echo "📝 Found shell profile: $SHELL_PROFILE"

# Check if auto-switch hook already exists
if grep -q "load-nvmrc" "$SHELL_PROFILE"; then
    echo "✅ Auto-switch hook already exists in $SHELL_PROFILE"
else
    echo "📝 Adding auto-switch hook to $SHELL_PROFILE..."
    cat >> "$SHELL_PROFILE" << 'EOF'

# Auto-switch Node version based on .nvmrc (added by Stratagem setup)
autoload -U add-zsh-hook 2>/dev/null || true
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
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
# Only add zsh hook if using zsh
if [ -n "$ZSH_VERSION" ]; then
  add-zsh-hook chpwd load-nvmrc
  load-nvmrc
fi
EOF
    echo "✅ Auto-switch hook added"
fi

echo ""
echo "✅ Configuration complete!"
echo ""
echo "📌 Next steps:"
echo "   1. Reload your shell: source $SHELL_PROFILE"
echo "   2. Or open a new terminal window"
echo "   3. Verify: cd /Users/adelsayed/Documents/Code/Stratagem && node --version"
echo ""
echo "💡 The auto-switch hook will automatically use Node 24 when you enter the project directory"




