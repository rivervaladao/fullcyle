#build stage - para compilar
FROM golang:1.20 AS build

WORKDIR /app

COPY . .

RUN go build -ldflags="-s -w" app.go

# final stage - imagem de produção
FROM scratch

WORKDIR /app

COPY --from=build /app/app .

ENTRYPOINT ["/app/app"]