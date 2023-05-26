FROM node:14.18.2
  
WORKDIR /usr/src/app

COPY package.json ./

RUN npm i -g @nestjs/cli@9.0.0 && npm install --force && npm install typeorm@0.3.7

#COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]      
