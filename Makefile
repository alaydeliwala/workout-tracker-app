.PHONY: dev build seed migrate studio reset init k8s-pvc deploy

init:
	npm install
	npx prisma generate
	npx prisma migrate deploy
	npx prisma db seed

dev: dev.db
	@pkill -f "next dev" 2>/dev/null || true
	@sleep 1
	npm run dev

dev.db:
	npx prisma generate
	npx prisma migrate deploy
	npx prisma db seed

build:
	npm run build

seed:
	npx prisma db seed

migrate:
	npx prisma migrate deploy

studio:
	npx prisma studio

reset:
	rm -f dev.db
	npx prisma generate
	npx prisma migrate deploy
	npx prisma db seed

k8s-pvc:
	kubectl apply -f k8s/pvc.yaml

deploy:
	kubectl apply -f k8s/pvc.yaml
	kubectl rollout restart deployment/workout-tracker-app
