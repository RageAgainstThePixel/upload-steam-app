const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs/promises');
const path = require('path');
const steamTotp = require('steam-totp');

const steamcmd = 'steamcmd';
const STEAM_DIR = process.env.STEAM_DIR;
const WORKSPACE = process.env.GITHUB_WORKSPACE;
const RUNNER_TEMP = process.env.RUNNER_TEMP;
const steamworks = path.join(RUNNER_TEMP, '.steamworks');

async function Run() {
    let printLogs = core.isDebug();

    try {
        const args = await getCommandArgs();
        await exec.exec(steamcmd, args);
    } catch (error) {
        printLogs = true;
        core.setFailed(error);
    }

    if (printLogs) {
        try {
            const logsDir = path.join(STEAM_DIR, 'logs');
            const logs = await fs.readdir(logsDir);
            for (const log of logs) {
                try {
                    const logContent = await fs.readFile(log, 'utf8');
                    core.info(logContent);
                } catch (error) {
                    log.error(`Failed to read log file: ${log}\n${error}`);
                }
            }
        } catch (error) {
            core.error(`Failed to read logs directory: ${logsDir}\n${error}`);
        }
    }
}

module.exports = { Run }

async function getCommandArgs() {
    if (!STEAM_DIR) {
        throw new Error('STEAM_DIR is not defined.');
    }

    let args = ['+@ShutdownOnFailedCommand', '1'];
    const username = core.getInput('username', { required: true });
    args.push('+login', username);
    const hasConfig = core.getInput('config') !== undefined;

    if (hasConfig) {
        const config = core.getInput('config');
        const configPath = path.join(STEAM_DIR, 'config', 'config.vdf');
        try {
            await fs.access(configPath, fs.constants.R_OK);
            core.warning('Steam user config.vdf file already exists! The existing file will be overwritten.');
        } catch (error) {
            // do nothing
        }
        await fs.writeFile(configPath, Buffer.from(config, 'base64'));
        await fs.access(configPath, fs.constants.R_OK);
    } else {
        const password = core.getInput('password', { required: true });
        const shared_secret = core.getInput('shared_secret', { required: true });
        const code = steamTotp.generateAuthCode(shared_secret);
        args.push(password, '+set_steam_guard_code', code);
    }

    let appBuildPath = core.getInput('app_build');

    if (appBuildPath) {
        await fs.access(appBuildPath, fs.constants.R_OK);
        args.push('+run_app_build', appBuildPath, '+quit');
        return args;
    }

    let workshopItemPath = core.getInput('workshop_item');

    if (workshopItemPath) {
        await fs.access(workshopItemPath, fs.constants.R_OK);
        args.push('+workshop_build_item', workshopItemPath, '+quit');
        return args;
    }

    const appId = core.getInput('app_id', { required: true });
    const contentRoot = core.getInput('content_root') || WORKSPACE;
    const description = core.getInput('description');

    const workshopItemId = core.getInput('workshop_item_id');

    if (workshopItemId) {
        workshopItemPath = await generateWorkshopItemVdf(appId, workshopItemId, contentRoot, description);
        args.push('+workshop_build_item', workshopItemPath, '+quit');
        return args;
    }

    const set_live = core.getInput('set_live');

    const depot_file_exclusions = core.getInput('depot_file_exclusions');
    let depot_file_exclusions_list = undefined;

    if (depot_file_exclusions) {
        depot_file_exclusions_list = depot_file_exclusions.split('\n');
    }

    const install_scripts = core.getInput('install_scripts');
    let install_scripts_list = undefined;

    if (install_scripts) {
        install_scripts_list = install_scripts.split('\n');
    }

    const depots = core.getInput('depots');
    let depots_list = undefined;

    if (depots) {
        depots_list = depots.split('\n');
    }

    appBuildPath = await generateBuildVdf(appId, contentRoot, description, set_live, depot_file_exclusions_list, install_scripts_list, depots_list);
    args.push('+run_app_build', appBuildPath, '+quit');
    return args;
};

async function generateWorkshopItemVdf(appId, workshopItemId, contentRoot, description) {
    await verify_temp_dir();
    const workshopItemPath = path.join(steamworks, 'workshop_item.vdf');
    let workshopItem = `"workshopitem"\n{\n\t"appid" "${appId}"\n\t"publishedfileid" "${workshopItemId}"\n\t"contentfolder" "${contentRoot}"\n`;
    if (description) {
        workshopItem += `\t"changenote" "${description}"\n`;
    }
    workshopItem += '}';
    core.debug(workshopItem);
    await fs.writeFile(workshopItemPath, workshopItem);
    await fs.access(workshopItemPath, fs.constants.R_OK);
    return workshopItemPath;
};

async function generateBuildVdf(appId, contentRoot, description, set_live, depot_file_exclusions_list, install_scripts_list, depots_list) {
    await verify_temp_dir();
    const appBuildPath = path.join(steamworks, 'app_build.vdf');
    let appBuild = `"AppBuild"\n{\n\t"AppID" "${appId}"\n\t"ContentRoot" "${contentRoot}"\n`;
    if (description) {
        appBuild += `\t"Desc" "${description}"\n`;
    }
    if (set_live) {
        appBuild += `\t"SetLive" "${set_live}"\n`;
    }
    if (depots_list) {
        appBuild += `\t"Depots"\n\t{\n`;
        let depotIndex = 1;
        depots_list.forEach(depot => {
            appBuild += `\t\t"${appId + depotIndex}" "${depot}"\n`;
            depotIndex++;
        });
        appBuild += `\t}\n`;
    } else {
        appBuild += `\t"Depots"\n\t{\n`;
        appBuild += `\t\t"DepotID" "${appId + 1}"\n`;
        appBuild += `\t\t"FileMapping"\n\t\t{\n`;
        appBuild += `\t\t\t"LocalPath" "*" // all files from content root folder\n`;
        appBuild += `\t\t\t"DepotPath" "." // mapped into the root of the depot\n`;
        appBuild += `\t\t\t"recursive" "1" // include all subfolders\n`;
        appBuild += `\t\t}\n`;

        if (depot_file_exclusions_list) {
            depot_file_exclusions_list.forEach(exclusion => {
                appBuild += `\t\t"FileExclusion" "${exclusion}"\n`;
            });
        }

        if (install_scripts_list) {
            install_scripts_list.forEach(script => {
                appBuild += `\t\t"InstallScript" "${script}"\n`;
            });
        }

        appBuild += `\t}\n`;
    }

    appBuild += '}';
    core.debug(appBuild);
    await fs.writeFile(appBuildPath, appBuild);
    await fs.access(appBuildPath, fs.constants.R_OK);
    return appBuildPath;
}

async function verify_temp_dir() {
    try {
        await fs.access(steamworks, fs.constants.R_OK);
        await fs.rm(steamworks, { recursive: true });
    } catch (error) {
        // do nothing
    }
    await fs.mkdir(steamworks);
}