#!/bin/bash
# Wrapper script to run next-devtools-mcp with Node 24
export PATH="/Users/adelsayed/.nvm/versions/node/v24.11.1/bin:$PATH"
export NODE_PATH="/Users/adelsayed/.nvm/versions/node/v24.11.1/lib/node_modules"
exec /Users/adelsayed/.nvm/versions/node/v24.11.1/bin/npx -y next-devtools-mcp@latest "$@"





