#/bin/sh

# To run: DOCKER_IMAGE=ghcr.io/hooktify-io/accounts-backend:latest ./__tests__/e2e/start_e2e.sh

docker-compose -f docker-compose.base.yml -f docker-compose.e2e.ci.yml up initializer

docker-compose -f docker-compose.base.yml -f docker-compose.e2e.ci.yml up --exit-code-from tests_runner api tests_runner
