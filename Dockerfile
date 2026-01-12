FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base as build
COPY . .
RUN npm i
RUN npm run build

FROM base AS deploy

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

RUN npm i

EXPOSE ${PORT}

CMD ["bun", "start"]
