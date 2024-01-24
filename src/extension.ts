import { ExtensionContext, commands, window, workspace, Uri } from 'vscode';
import { basename } from 'path';

export function activate(context: ExtensionContext) {
	let disposable = commands.registerCommand('extension.jumpToTheTest', () => {
    const filePath = window.activeTextEditor?.document.fileName;
    if(!filePath){
      window.setStatusBarMessage('jumpToTheTest: Need a open file', 3000);
      return;
    }

    const file = basename(filePath);
    const globPattern = getGlobPattern(file);

    console.log('globPattern:', globPattern);
    workspace.findFiles(globPattern, null, 1).then((ps: Uri[]): void => {
      if (ps.length === 0) {
        window.setStatusBarMessage('jumpToTheTest: Unable to find test file', 3000);
        return;  
      }  

      commands.executeCommand('vscode.open', Uri.file(ps[0].path));
    });

    function getGlobPattern(file :string): string {
      const fileName = getFileName(file);
      const fileExtension = getFileExtension(file);

      let possibleFileName;
      let possibleFileExtension;
      if(isTestFile(fileName)){
        possibleFileName = getFileGlobPattern(fileName);
        possibleFileExtension = getExtensionGlobPattern(fileExtension);
      } else {
        possibleFileName = getTestFileGlobPattern(fileName);
        possibleFileExtension = getTestExtensionGlobPattern(fileExtension);
      }
      return `**/${possibleFileName}.${possibleFileExtension ?? fileExtension}`;
    }

    function getFileName(file :string): string {
      return file.replace(/\.[^\.]*$/, '');
    }

    function getFileExtension(file :string): string {
      return file.replace(/^[\w\W]*\./, '');
    }

    function getExtensionGlobPattern(fileExtension: string): string | null{
      let extension = null;
      if (['js','ts'].includes(fileExtension)) {
        extension = `{${fileExtension},vue}`;
      }
      return extension;
    }

    function getTestExtensionGlobPattern(fileExtension: string): string | null{
      let extension = null;
      if(fileExtension==='vue'){
        extension = '{ts,js}';
      } 
      return extension;
    }

    function isTestFile(fileName: string): boolean{
      return /(spec|test)/i.test(fileName);
    }

    function getFileGlobPattern(testFileName: string): string {
      const postfix: string = getPostfix(testFileName);
      return testFileName.replace(new RegExp(`(${!postfix?'':`\\${postfix}|`}\\.)?(spec|test)$`, 'i'), '');
    }

    function getTestFileGlobPattern(fileName: string): string{
      const postfix: string = getPostfix(fileName);

      let spec = 'spec';
      let test = 'test';
      if(hasUpperCase(fileName)){
        spec = 'Spec';
        test = 'Test';
      }
      return `${fileName}{${postfix}${spec},${postfix}${test},.spec,.test}`;
    }

    function getPostfix(fileName: string): string{
      let postfix = '';
      if(fileName.includes('-')){
        postfix = '-';
      } else if (fileName.includes('_')) {
        postfix = '_';
      }
      return postfix;
    }

    function hasUpperCase(fileName: string): boolean{
      return /[A-Z]+/.test(fileName);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
