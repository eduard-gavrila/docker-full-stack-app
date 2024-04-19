.PHONY: start
start:
	docker-compose -f ./database/docker-compose.yml up

.PHONY: stop
stop:
	docker-compose -f ./database/docker-compose.yml down