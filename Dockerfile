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

# Resolve LFS pointer files into actual binaries before the Next.js
# build copies /public/ into the production output.
RUN git lfs install --local \
  && git lfs pull

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
