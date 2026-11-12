FROM node:24-bookworm-slim

ENV HUSKY=0 \
    NEXT_TELEMETRY_DISABLED=1

RUN npm install -g pnpm@12.18.0

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

ARG NEXT_PUBLIC_API_URL
ARG SOCKET_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    SOCKET_URL=$SOCKET_URL

RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "start"]