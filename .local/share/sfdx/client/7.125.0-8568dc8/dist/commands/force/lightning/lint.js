"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const LintCommand = require("salesforce-lightning-cli/commands/lightning/lint");
class ForceLintCommand extends LintCommand {
}
ForceLintCommand.deprecated = {
    message: 'To lint Aura components, use the @salesforce/eslint-plugin-aura node package. See https://github.com/forcedotcom/eslint-plugin-aura for details.',
    name: 'force:lightning:lint',
    version: 52,
};
module.exports = ForceLintCommand;
//# sourceMappingURL=lint.js.map