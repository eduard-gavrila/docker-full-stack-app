.PHONY: start
start:
	docker-compose up --build

.PHONY: stop
stop:
	docker-compose down

.PHONY: build-api
build-api:
	docker build -t jokes-api -f ./server/Dockerfile .