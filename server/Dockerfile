FROM node:24-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY package.json ./
RUN pnpm install --prod
COPY index.js ./
ENV NODE_ENV=production PORT=3001
EXPOSE 3001
USER node
CMD ["node", "index.js"]