#!/usr/bin/env bash

.PHONY: help install dev build start seed lint format clean docker-build docker-up docker-down

help:
	@echo "Atlas Tech Backend - Available Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install      - Install dependencies"
	@echo "  make setup        - Install dependencies and seed database"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development server"
	@echo "  make seed         - Seed database with initial data"
	@echo "  make lint         - Run ESLint"
	@echo "  make format       - Format code with Prettier"
	@echo ""
	@echo "Production:"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-up    - Start services with docker-compose"
	@echo "  make docker-down  - Stop services"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make monogo-start - Start MongoDB in Docker"

install:
	npm install

setup: install
	npm run seed

dev:
	npm run dev

build:
	npm run build

start:
	npm start

seed:
	npm run seed

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf dist node_modules .eslintcache

docker-build:
	docker build -t atlas-tech-backend .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

mongodb-start:
	docker run -d -p 27017:27017 --name mongodb mongo:latest

.DEFAULT_GOAL := help
