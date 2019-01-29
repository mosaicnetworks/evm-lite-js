FROM golang:alpine
COPY evml /usr/src/evm-lite/
WORKDIR /usr/src/evm-lite/
RUN chmod u+x ./evml
ENTRYPOINT [ "./evml" ]
