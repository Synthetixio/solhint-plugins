const BaseChecker = require("solhint/lib/rules/base-checker");

const ruleId = "only-payable";

const meta = {
	type: "best-practises",

	docs: {
		description: "All functions should be payable.",
		category: "",
	},

	isDefault: false,
	recommended: false,
	defaultSetup: "error",
	fixable: true,

	schema: null,
};

class PayableFunctionChecker extends BaseChecker {
	constructor(reporter, config, inputSrc) {
		super(reporter, ruleId, meta);

		this.config = config;
		this.inputSrc = inputSrc;
	}

	FunctionDefinition(node) {
		// only include functions within contract definitions
		if (node.parent.type !== "ContractDefinition" || node.parent.kind !== "contract") {
			return;
		}

		if ((node.visibility === "public" || node.visibility === "external") && !node.stateMutability) {
			//console.log("the parent", node.parent);

			this.error(node, "Function should be payable or view.", (fixer) => {
				// console.log("FIXER CALLED", fixer);
				const range = [node.range[0], node.body ? node.body.range[0] - 1 : node.range[1]];
				let replacedText = this.inputSrc.slice(range[0], range[1] + 1);
				replacedText = replacedText.replace(/(external|public)/, "$1 payable");
				// console.log("the fix", replacedText);
				return fixer.replaceTextRange(range, replacedText);
			});
		}
	}
}

module.exports = [PayableFunctionChecker];
