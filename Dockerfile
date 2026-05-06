# Dockerfile for Railway.
#
# We use an explicit Dockerfile because Nixpacks/Railpack don't pull
# Git LFS objects during build by default — without that, every audio
# file in /public/possibilia/ ships as a 133-byte LFS pointer text and
# the <audio> player has nothing to decode. The repo is public, so the
# LFS pull below works anonymously.

# ---------- builder ----------
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

# Resolve LFS pointer files into actual binaries before the Next.js
# build copies /public/ into the production output. Best-effort — if
# the LFS pull fails for any reason, we still want the rest of the
# build to succeed (the audio just won't play, which is the same
# state we have today and a much better outcome than blocking deploy
# of unrelated changes).
RUN git lfs install --local && (git lfs pull || echo "WARN: git lfs pull failed — audio will be silent until this is fixed")

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
