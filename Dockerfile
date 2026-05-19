FROM node:20-alpine

RUN corepack enable
WORKDIR /app
RUN chown -R node:node /app
USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
