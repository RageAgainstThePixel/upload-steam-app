const core = require('@actions/core');
const fs = require('fs/promises');

async function PrintLogs(directory) {
    core.debug(`Reading logs from: ${directory}`);
    try {
        const logs = await fs.readdir(directory);
        for (const log of logs) {
            try {
                const logContent = await fs.readFile(log, 'utf8');
                core.info(`::group::${log}`);
                core.info(logContent);
                core.info('::endgroup::');
            } catch (error) {
                core.error(`Failed to read log: ${log}\n${error}`);
            }
        }
    } catch (error) {
        core.error(`Failed to read logs in ${directory}!\n${error}`);
    }
}

module.exports = { PrintLogs }
