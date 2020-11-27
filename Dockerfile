ARG WORKER_IMAGE
FROM $WORKER_IMAGE AS base

ENV KUBECTL_VERSION="v1.17.14"

RUN apk upgrade --no-cache && \
    mkdir -p /opt/app/dft-street-manager-worker && \
    mkdir -m 777 -p /opt/app/dft-street-manager-worker/tmp \
    mkdir -m 777 -p /opt/app/dft-street-manager-worker/resources

WORKDIR /opt/app/dft-street-manager-worker

ENTRYPOINT ["/sbin/tini", "--"]

COPY package.json .

COPY package-lock.json .

COPY resources /opt/app/dft-street-manager-worker/resources

FROM base AS dependencies

RUN apk add --no-cache \
      g++ \
      git \
      make \
      openssh-client \
      python \
      curl \
      jq

RUN set -xe; \
  echo "*** Installing KUBECTL ${KUBECTL_VERSION} ***"; \
  curl -sLo /usr/local/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl ; \
  chmod +x /usr/local/bin/kubectl ; \
  echo "*** DONE ***";

COPY . .

RUN mkdir ~/.ssh && \
  ssh-keyscan github.com > ~/.ssh/known_hosts && \
  cp .ssh/id_rsa ~/.ssh/id_rsa

RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --only=production && \
    cp -R node_modules prod_node_modules && \
    npm install && \
    npm run build && \
    npm run test

FROM base AS release

COPY --from=dependencies /opt/app/dft-street-manager-worker/dist /opt/app/dft-street-manager-worker/dist
COPY --from=dependencies /opt/app/dft-street-manager-worker/prod_node_modules /opt/app/dft-street-manager-worker/node_modules
COPY --from=dependencies /usr/local/bin/kubectl /usr/local/bin/kubectl

RUN chown nodejs:nodejs -R /opt/app/dft-street-manager-worker

USER nodejs

CMD npm run start
