# ============================================================
#  星天的主站 —— 常用命令
#  手机端（Termux / proot 里的 Ubuntu）也能直接 make
# ============================================================

# 工作区里的 Node 22；不用工作区时系统 node 生效即可
NODE_BIN ?= /workspace/.tools/node/bin
export PATH := $(NODE_BIN):$(PATH)

PORT        ?= 5173
STATIC_PORT ?= 4173
DIR         ?= dist

.PHONY: help install dev build smoke check serve pack clean

help:
	@echo "星天的主站 —— 常用命令"
	@echo ""
	@echo "  make install      装依赖（npm install）"
	@echo "  make dev          开发服务器（热更新），手机浏览器开 http://127.0.0.1:$(PORT)/"
	@echo "  make build        构建 + 后处理，产出 dist/ 与 dist-single/"
	@echo "  make check        build 之后 dist / dist-single 各跑一遍冒烟测试"
	@echo "  make smoke        只跑冒烟测试（已构建过再用）"
	@echo "  make serve        起个静态预览服务器：http://127.0.0.1:$(STATIC_PORT)/"
	@echo "                    （默认服务 dist/，换目录：make serve DIR=dist-single）"
	@echo "  make pack         打一份源码压缩包 xing-tian-source.zip"
	@echo "  make clean        删掉 dist / dist-single"

install:
	npm install

dev:
	npm run dev -- --host 0.0.0.0 --port $(PORT)

build:
	npm run build
	node tools/postbuild.mjs

smoke:
	node tools/smoke.mjs dist
	node tools/smoke.mjs dist-single

check: build smoke

serve:
	node tools/preview.mjs $(DIR) $(STATIC_PORT)

pack:
	rm -f xing-tian-source.zip
	python3 tools/pack.py

clean:
	rm -rf dist dist-single
