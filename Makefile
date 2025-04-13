CONTAINER = erdv2_dev

install: # build container image
	docker-compose build

start: # start container in the background
	docker-compose up --detach
	CMD /C start chrome http://localhost:3000

# Expose local dev server to internet
# so people can access your local dev
localonline:
	ngrok http 3000

# Stop containers, but does not remove them.
# @see https://nickjanetakis.com/blog/docker-tip-45-docker-compose-stop-vs-down
stop:
	docker-compose stop

# Add yarn modules
# - locally (for code editor completion)
# - inside the container
# @see https://stackoverflow.com/a/6273809/1152843
yarnadd:
	yarn add $(filter-out $@,$(MAKECMDGOALS))
	docker exec -it ${CONTAINER} yarn add $(filter-out $@,$(MAKECMDGOALS))

# Remove yarn modules
# - locally
# - inside the container
yarnremove:
	yarn remove $(filter-out $@,$(MAKECMDGOALS))
	docker exec -it ${CONTAINER} yarn remove $(filter-out $@,$(MAKECMDGOALS))

# Open Culligan-specific Optitime API documentation
openwsdoc:
	CMD /C start chrome $(CURDIR)/docs/api-ws-optitime-culligan/list.html
	
# rebuild
# 1. remove volumes, images, containers
# 2. rebuild, while making sure it doesn't use the internal cache 
# 3. restart in background
# Note: to call the 'reset' target, it needs to be on the same line
# 			as the current target, otherwise the 'reset' command gets called
rebuild: reset 
	docker-compose build --no-cache
	docker-compose up --detach

# remove volumes, images, containers
reset:
	docker-compose down \
		--volumes \
		--rmi all \
		--remove-orphans

# used by dynamic "add" goal
# @see https://stackoverflow.com/a/6273809/1152843
%:
    @: 
