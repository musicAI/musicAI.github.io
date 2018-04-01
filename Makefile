PUB_DIR =public#
FUNC_DIR =functions#

deploy: $(PUB_DIR) $(FUNC_DIR)
	@echo "page deployed"
	

$(PUB_DIR): index.html
	@mkdir -p $(PUB_DIR)
	-@cp *.html *.ico $(PUB_DIR)/
	
$(FUNC_DIR): lambda
	@mkdir -p $(FUNC_DIR)
	-@cp -r lambda/* $(FUNC_DIR)/


.PHONY: clean run

clean:
	-@rm -rf $(PUB_DIR)/ $(FUNC_DIR)/

run: $(FUNC_DIR)
	@netlify-lambda serve $(FUNC_DIR)