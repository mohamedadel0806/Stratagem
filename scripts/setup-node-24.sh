#!/bin/bash

# Setup Node 24 for the project
# This script ensures Node 24 is used consistently

echo "🔧 Setting up Node 24 for Stratagem project..."

# Check if nvm is available
if ! command -v nvm &> /dev/null; then
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    else
        echo "❌ nvm is not installed. Please install nvm first."
        exit 1
    fi
fi

# Install Node 24 if not already installed
if ! nvm list | grep -q "v24"; then
    echo "📦 Installing Node 24..."
    nvm install 24
fi

# Set Node 24 as default
echo "✅ Setting Node 24 as default..."
nvm alias default 24
nvm use 24

# Create .nvmrc files
echo "📝 Creating .nvmrc files..."
echo "24" > .nvmrc
echo "24" > frontend/.nvmrc
echo "24" > backend/.nvmrc

# Verify Node version
NODE_VERSION=$(node --version)
echo ""
echo "✅ Setup complete!"
echo "📌 Current Node version: $NODE_VERSION"
echo ""
echo "💡 Tip: Add this to your ~/.zshrc or ~/.bashrc to auto-switch Node versions:"
echo "   # Auto-switch Node version based on .nvmrc"
echo "   autoload -U add-zsh-hook"
echo "   load-nvmrc() {"
echo "     local node_version=\$(nvm version)"
echo "     local nvmrc_path=\$(nvm_find_nvmrc)"
echo ""
echo "     if [ -n \"\$nvmrc_path\" ]; then"
echo "       local nvmrc_node_version=\$(nvm version \"\$(cat \"\$nvmrc_path\")\")"
echo ""
echo "       if [ \"\$nvmrc_node_version\" = \"N/A\" ]; then"
echo "         nvm install"
echo "       elif [ \"\$nvmrc_node_version\" != \"\$node_version\" ]; then"
echo "         nvm use"
echo "       fi"
echo "     elif [ \"\$node_version\" != \"\$(nvm version default)\" ]; then"
echo "       echo \"Reverting to nvm default version\""
echo "       nvm use default"
echo "     fi"
echo "   }"
echo "   add-zsh-hook chpwd load-nvmrc"
echo "   load-nvmrc"







