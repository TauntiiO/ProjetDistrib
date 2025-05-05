FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/app.js ./
COPY --from=builder /app/db.js ./
EXPOSE 3000
CMD ["node", "app.js"]