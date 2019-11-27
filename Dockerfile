FROM node

ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

COPY /.  .
RUN npm install
RUN npm run build
RUN npm install -g serve
CMD ["serve","-s","build"]
EXPOSE 3000
