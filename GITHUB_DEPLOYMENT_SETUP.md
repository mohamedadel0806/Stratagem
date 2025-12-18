# GitHub
To enable deployment, you need to add configuration to your GitHub repository:

1.  Open your repository on GitHub.com.
2.  Click the **Settings** tab.
3.  In the left sidebar, go to **Secrets and variables** > **Actions**.
4.  You will see two tabs: **Secrets** (for sensitive data) and **Variables** (for public data).

### GitHub Secrets (Select the "Secrets" tab)
| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `SSH_PRIVATE_KEY` | Your SSH private key | Content of `ssh-oracle-24.key` |
| `NEXTAUTH_SECRET` | Secure random string | (See generation tip below) |

> [!TIP]
> **To get a NEXTAUTH_SECRET:**
> You can find your existing one in your local `.env` file, or generate a new random one by running this in your terminal:
> `openssl rand -base64 32`

### GitHub Variables (Settings > Secrets and variables > Actions > Variables)
| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `REMOTE_HOST` | Server IP address | `84.235.247.141` |
| `REMOTE_USER` | SSH username | `ubuntu` |
| `NEXT_PUBLIC_API_URL` | Production API URL | `https://grc-staging.newmehub.com/api` |
| `FRONTEND_URL` | Production Frontend URL | `https://grc-staging.newmehub.com` |

## 2. Running the Deployment

All deployments are now **manual** to give you full control. Go to the **Actions** tab in GitHub to run them:

### Option A: Standard Deployment (Pre-built GHCR)
This is the recommended way. It builds ARM64 images in the cloud and pulls them to your server.
- **Workflow**: `Deploy to Production (GHCR ARM64)`

### Option B: Legacy Deployment (Rsync)

If you prefer to build directly on the server (like the original approach):
1. Go to the **Actions** tab in GitHub.
2. Select the **"Deploy to Production (Legacy Rsync)"** workflow.
3. Click **Run workflow**.

This will transfer your source code via `rsync` and run `docker compose build` on the server.

## 4. Manual Database Restore (Optional)

If you need to completely overwrite the server's database with your local data, you have two options in the **Actions** tab:

### Option A: GHCR Restore (Fastest)
Use this if your `main` branch is already up-to-date on GitHub. It pulls pre-built ARM64 images.
- **Workflow**: `Deploy with Full Database Restore`
- **Steps**: Commit/push `database-export/` -> Run Workflow.

### Option B: Rsync Restore (Build on Server)
Use this if you want to deploy local code changes that aren't on GitHub yet, along with a database restore.
- **Workflow**: `Deploy with DB (Rsync ARM64 Build)`
- **Steps**: Commit/push `database-export/` -> Run Workflow.

> [!CAUTION]
> Both options will DROP the existing `grc_platform` database on the server.

## 5. Troubleshooting

If the deployment fails:
- Check the logs in the GitHub Actions dashboard.
- Ensure the `SSH_PRIVATE_KEY` has permission to access the server.
- Verify that the server directory `/opt/stratagem` exists and the `ubuntu` user has write permissions to it.
