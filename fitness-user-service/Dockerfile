# Étape de construction (builder)
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production  # N'installe que les dépendances nécessaires
COPY . .

# Étape finale (image légère)
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "app.js"]