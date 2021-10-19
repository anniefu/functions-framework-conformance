import * as core from '@actions/core';
import * as childProcess from 'child_process';

/**
 * Run a specified command.
 * @param {string} cmd - command to run
 */
function runCmd(cmd: string) {
  try {
    console.log(`RUNNING: "${cmd}"`)
    childProcess.execSync(cmd);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function run() {
  const version = core.getInput('version');
  const outputFile = core.getInput('outputFile');
  const functionType = core.getInput('functionType');
  const validateMapping = core.getInput('validateMapping');
  const source = core.getInput('source');
  const target = core.getInput('target');
  const runtime = core.getInput('runtime');
  const tag = core.getInput('tag');
  const useBuildpacks = core.getInput('useBuildpacks');
  const cmd = core.getInput('cmd');
  const startDelay = core.getInput('startDelay');
  const workingDirectory = core.getInput('workingDirectory');

  // Install conformance client binary.
  let branchTag = ''
  if (version) {
    branchTag = `--branch ${version}`
  }
  // go get with path@version only works within a go module
  runCmd(`git clone https://github.com/GoogleCloudPlatform/functions-framework-conformance.git ${branchTag}`)
  runCmd(`cd functions-framework-conformance/client && go build -o ~/client`)

  // Run the client with the specified parameters.
  runCmd([
    !!workingDirectory ? `cd ${workingDirectory} &&` : '',
    `~/client`,
    `-output-file=${outputFile}`,
    `-type=${functionType}`,
    `-validate-mapping=${validateMapping}`,
    `-builder-source=${source}`,
    `-builder-target=${target}`,
    `-builder-runtime=${runtime}`,
    `-builder-tag=${tag}`,
    `-buildpacks=${useBuildpacks}`,
    `-cmd=${cmd}`,
    `-start-delay=${startDelay}`,
  ].filter((x) => !!x).join(' '));
}

run();
