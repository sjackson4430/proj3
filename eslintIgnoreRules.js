const fs = require('fs');
const { SourceCode, CLIEngine } = require('eslint');

const cli = new CLIEngine();
const reports = cli.executeOnFiles(['src/**/*.js']);
reports.results.forEach(fileReport => {
  const { filePath } = fileReport;
  const codeString = fs.readFileSync(filePath).toString();
  const codeLines = SourceCode.splitLines(codeString);

  fileReport.messages.forEach(lintingMessage => {
    const disableMsg = `/* eslint ${lintingMessage.ruleId}:0 */`;
    // ignore if the the rule was already there
    if (codeLines.includes(disableMsg)) return;
    codeLines.splice(0, 0, disableMsg);
  });
  fs.writeFile(filePath, codeLines.join('\n'), err => err && console.log(err));
});
