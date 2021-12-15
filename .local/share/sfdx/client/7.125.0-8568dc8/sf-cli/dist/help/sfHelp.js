"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const core_1 = require("@oclif/core");
const sfCommandHelp_1 = require("./sfCommandHelp");
class SfHelp extends core_1.Help {
    constructor() {
        super(...arguments);
        this.CommandHelpClass = sfCommandHelp_1.SfCommandHelp;
        this.showShortHelp = false;
    }
    async showHelp(argv) {
        this.showShortHelp = argv.includes('-h');
        return await super.showHelp(argv);
    }
    getCommandHelpClass(command) {
        this.commandHelpClass = super.getCommandHelpClass(command);
        this.commandHelpClass.showShortHelp = this.showShortHelp;
        return this.commandHelpClass;
    }
}
exports.default = SfHelp;
//# sourceMappingURL=sfHelp.js.map