# Dockerfile for Railway.
#
# We dropped to an explicit Dockerfile because Nixpacks (and now
# Railpack) wasn't reliably running `git lfs pull` during deploy —
# every audio file in /public/possibilia/ was shipping as the 133-byte
# LFS pointer text and the <audio> element silently failed. A Dockerfile
# is the one path Railway always honors unmodified, so the LFS pull
# happens deterministically in the build.

# ---------- deps + LFS ----------
FROM node:20-bookworm-slim AS builder

# git-lfs needs git itself + curl. ca-certificates so HTTPS to GitHub
# LFS works. --no-install-recommends keeps the layer small.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    git-lfs \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything (including .git) so `git lfs pull` can resolve
# pointers against the remote. .dockerignore keeps node_modules and
# .next out of the build context so this stays cheap.
COPY . .

# Auth for the LFS pull. The repo is currently private, so without a
# token `git lfs pull` returns 401 and we end up shipping pointer files.
# Two paths both work:
#   - Repo is public → no token needed, git lfs pull just works.
#   - Repo is private → set GITHUB_TOKEN in Railway's service env
#     (a fine-grained PAT scoped to this repo with `contents:read` is
#     enough). Railway forwards env vars as build args, and the
#     conditional below rewrites github.com URLs to include the token
#     only when it's actually set.
ARG GITHUB_TOKEN=""
RUN if [ -n "$GITHUB_TOKEN" ]; then \
      git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"; \
    fi \
  && git lfs install --local \
  && git lfs pull \
  && git config --global --unset-all url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf || true

RUN npm ci --include=dev

RUN npm run build

# ---------- runtime ----------
FROM node:20-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Pull just the artifacts we need to run `next start`. No git, no
# git-lfs, no source — keeps the runtime image small.
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm", "start"]
