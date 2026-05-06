# Dockerfile for Railway.
#
# Drops to an explicit Dockerfile because Nixpacks/Railpack wasn't
# reliably running `git lfs pull` during deploy — every audio file in
# /public/possibilia/ was shipping as the 133-byte LFS pointer text and
# the <audio> element silently failed. With a Dockerfile present,
# Railway should use this exclusively, so the LFS pull happens
# deterministically before the Next.js build.

# ---------- deps + LFS ----------
FROM node:20-bookworm-slim AS builder

# git-lfs needs git itself + ca-certificates so HTTPS to GitHub LFS
# works. --no-install-recommends keeps the layer small.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    git-lfs \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything (including .git) so `git lfs pull` can resolve
# pointers against the remote. .dockerignore keeps node_modules and
# .next out of the build context.
COPY . .

# Diagnostic marker — lets us confirm from production that this
# Dockerfile is actually the build path Railway is using. Reachable at
# /_build-marker.txt on the deployed site. If the URL 404s, Railway is
# bypassing the Dockerfile and using Nixpacks/Railpack instead.
RUN echo "via Dockerfile @ $(date -u +%Y-%m-%dT%H:%M:%SZ)" > public/_build-marker.txt

# Auth for the LFS pull. Public repo → no token needed. Private repo
# → set GITHUB_TOKEN in Railway's service env (fine-grained PAT with
# contents:read on this repo). The token only ever lives in this
# builder layer's git config; we unset it before the layer commits.
ARG GITHUB_TOKEN=""
RUN if [ -n "$GITHUB_TOKEN" ]; then \
      git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"; \
    fi \
  && git lfs install --local \
  && git lfs pull \
  && git config --global --unset-all url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf || true

# Hard-fail the build if LFS pull didn't actually resolve the
# pointers. Without this, a silent LFS failure produces a successful
# build that ships pointer files — exactly the symptom we're trying
# to fix. Better to break the deploy and see it in Railway logs than
# to ship dead audio.
RUN set -e; \
    SAMPLE=public/possibilia/cyber-robot-ai-wartime/story.mp3; \
    if [ ! -f "$SAMPLE" ]; then \
      echo "FATAL: $SAMPLE missing — repo state is wrong"; exit 1; \
    fi; \
    SIZE=$(wc -c < "$SAMPLE"); \
    if [ "$SIZE" -lt 1000 ]; then \
      echo "FATAL: LFS pull failed — $SAMPLE is $SIZE bytes (pointer file). Contents:"; \
      cat "$SAMPLE"; \
      exit 1; \
    fi; \
    echo "OK: LFS pull succeeded — $SAMPLE is $SIZE bytes"; \
    echo "lfs ok @ $(date -u +%Y-%m-%dT%H:%M:%SZ); $SAMPLE = $SIZE bytes" > public/_lfs-marker.txt

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
