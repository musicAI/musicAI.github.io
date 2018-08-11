PUB_DIR =public#
FUNC_DIR =functions#
SRC_DIR =lambda#
LIB_DIR =lib#

deploy: $(PUB_DIR) build
	@echo "page deployed"
	

$(PUB_DIR): index.html
	@npm run deploy	

run: $(SRC_DIR)
	@npm test

build: $(LIB_DIR) $(SRC_DIR)
	@git submodule update
	@which netlify-lambda || npm install 
	@npm run build


.PHONY: clean install

clean:
	-@rm -rf $(PUB_DIR)/ $(FUNC_DIR)/

install:
	-@npm install