FROM node:18-alpine
WORKDIR /app/backend
ENV HOST=0.0.0.0
COPY . ./
RUN npm install
EXPOSE 8000
CMD ["npm", "run", "start"]

