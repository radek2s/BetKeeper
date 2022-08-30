FROM node:18-alpine
#backend_stage
WORKDIR /app/backend
COPY /backend/package.json .
RUN npm install
#RUN npm run start
#main_stage
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . ./
EXPOSE 3000
EXPOSE 8000

RUN chmod 777 starting_script.sh
CMD ["/bin/sh", "./starting_script.sh"]




