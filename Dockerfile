FROM node:22-alpine

ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY . .

RUN npm ci

CMD ["node", "./src/spectrogram/spectrogram.worker.js"]