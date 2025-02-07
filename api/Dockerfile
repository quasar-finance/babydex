
# Use 'slim' variant due to its reduced size
FROM node:20-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS prod-deps
COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build


FROM base
# Copy from previous steps
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/dist /app

# Execute
CMD node ./server.js

# Port exposing
EXPOSE 8080
