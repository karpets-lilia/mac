"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const os = require("os");
const path = require("path");
const shelljs_1 = require("shelljs");
const appInsights_1 = require("@salesforce/telemetry/lib/appInsights");
const cli_ux_1 = require("cli-ux");
function sendEvent(data) {
    if (global.cliTelemetry && global.cliTelemetry.record) {
        global.cliTelemetry.record(data);
    }
}
function suggestAlternatives() {
    cli_ux_1.cli.log('Failed to install sf. Try one of the following:');
    cli_ux_1.cli.log('- npm: npm install @salesforce/cli --global');
    if (process.platform === 'win32') {
        cli_ux_1.cli.log('- installer: https://developer.salesforce.com/media/salesforce-cli/sf/channels/stable/sf-x64.exe');
    }
    else if (process.platform === 'darwin') {
        cli_ux_1.cli.log('- installer: https://developer.salesforce.com/media/salesforce-cli/sf/channels/stable/sf.pkg');
    }
    else {
        cli_ux_1.cli.log('- download: https://developer.salesforce.com/media/salesforce-cli/sf/channels/stable/sf-linux-x64.tar.gz');
    }
}
/**
 * Return true if any part of the sf executable path contains a string that is known
 * to be part of an npm path.
 */
function isNpmInstall(sfPath) {
    const nodePathParts = ['node', 'nodejs', '.nvm', '.asdf', 'node_modules', 'npm', '.npm'];
    const sfPathParts = sfPath.split(path.sep);
    return sfPathParts.filter((p) => nodePathParts.includes(p.toLowerCase())).length > 0;
}
/**
 * We want to skip the sf installation if there's an existing installation that is NOT
 * from npm. In other words, if the user has already installed sf with the installer,
 * we do not want to overwrite it.
 */
function isBinaryInstall() {
    var _a;
    const existingSf = (_a = shelljs_1.which('sf')) === null || _a === void 0 ? void 0 : _a.stdout;
    if (existingSf)
        return !isNpmInstall(existingSf);
    return false;
}
/**
 * In order to install sf for users who use the installers, we've added
 * this hook which will install sf via npm after sfdx update completes.
 *
 * This is not a sufficient solution as there are likely many users who
 * do not have npm installed on their machine. For this reason, we are
 * logging that information to app insights so that we decide which solutions
 * we need to build next to ensure sf is available to all sfdx users.
 *
 */
// eslint-disable-next-line @typescript-eslint/require-await
const hook = async function () {
    var _a, _b, _c, _d;
    let succcess = false;
    const sfdxVersion = ((_a = shelljs_1.exec('sfdx --version', { silent: true })) === null || _a === void 0 ? void 0 : _a.stdout) || 'unknown';
    // Skip the install if there's an existing sf that was installed by an installer
    if (isBinaryInstall()) {
        succcess = true;
        return;
    }
    cli_ux_1.cli.action.start('sfdx-cli: Installing sf');
    try {
        const npmInstallation = (_b = shelljs_1.which('npm')) === null || _b === void 0 ? void 0 : _b.stdout;
        if (!npmInstallation) {
            sendEvent({
                eventName: 'POST_SFDX_UPDATE_SF_INSTALL_ERROR',
                type: 'EVENT',
                message: 'npm not installed on machine',
                sfdxVersion,
            });
            return;
        }
        const installResult = shelljs_1.exec('npm install -g @salesforce/cli', { silent: true });
        if (installResult.code > 0) {
            sendEvent({
                eventName: 'POST_SFDX_UPDATE_SF_INSTALL_ERROR',
                type: 'EVENT',
                message: 'npm global install failed',
                stackTrace: (_c = installResult.stderr) === null || _c === void 0 ? void 0 : _c.replace(new RegExp(os.homedir(), 'g'), appInsights_1.AppInsights.GDPR_HIDDEN),
                sfdxVersion,
            });
            return;
        }
        succcess = true;
        const sfVersion = shelljs_1.exec('sf --version', { silent: true }).stdout;
        sendEvent({
            eventName: 'POST_SFDX_UPDATE_SF_INSTALL_SUCCESS',
            type: 'EVENT',
            message: 'sf install succeeded',
            sfVersion,
            sfdxVersion,
        });
    }
    catch (error) {
        const err = error;
        succcess = false;
        sendEvent({
            eventName: 'POST_SFDX_UPDATE_SF_INSTALL_ERROR',
            type: 'EVENT',
            message: err.message,
            stackTrace: (_d = err === null || err === void 0 ? void 0 : err.stack) === null || _d === void 0 ? void 0 : _d.replace(new RegExp(os.homedir(), 'g'), appInsights_1.AppInsights.GDPR_HIDDEN),
            sfdxVersion,
        });
        return;
    }
    finally {
        cli_ux_1.cli.action.stop(succcess ? 'done' : 'failed');
        if (!succcess)
            suggestAlternatives();
    }
};
exports.default = hook;
//# sourceMappingURL=postupdate.js.map