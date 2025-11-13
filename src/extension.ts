import * as vscode from "vscode";
import * as path from "path";
import { exec } from "child_process";

export function activate(context: vscode.ExtensionContext) {

  console.log('Congratulations, your extension "dotnet-run" is now active!');

  const checkDotnet = vscode.commands.registerCommand("dotnet-run.checkDotnet", () => {
      const csharp = vscode.extensions.getExtension("ms-dotnettools.csdevkit");
      if (csharp) {
        vscode.window.showInformationMessage("1.✅ C# dev kit extension detected!");
      } else {
        vscode.window.showWarningMessage("❌ C# dev kit extension not found. Some features may not work.");
      }
      exec("dotnet --version", async (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage("❌ .NET SDK not found! Please install .NET 10.x.");
          return;
        }
        const version = stdout.trim(); // e.g. "10.0.101"
        if (version.startsWith("10.")) {
          vscode.window.showInformationMessage(`2.✅ .NET 10 is installed (version: ${version})`);
        } else {
          const choice = await vscode.window.showErrorMessage(
            "Do you want to download .NET 10 SDK?",
            "Download",
            "Cancel"
          );

          if (choice === "Download") {
            vscode.env.openExternal(
              vscode.Uri.parse("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-10.0.100-windows-x64-installer")
            );
          }
        }
      });
    });
  context.subscriptions.push(checkDotnet);
  const developerInfo = vscode.commands.registerCommand("dotnet-run.developerInfo", () => {
      vscode.window.showInformationMessage(
        "Takliflar uchun Telegram or Instagram @DeveloperTemur"
      );
    }
  );
  context.subscriptions.push(developerInfo);


  const runWithDotnet = vscode.commands.registerCommand(
    "dotnet-run.runWithDotnet",
    async (uri: vscode.Uri) => {
      const filePath = uri.fsPath;
      const fileDir = path.dirname(filePath);
      const filename = path.basename(filePath);
      vscode.window.showInformationMessage(
        `Running: ${filename} from developertemur`
      );

      const terminal = vscode.window.createTerminal({
        name: "dotnet runner",
        cwd: fileDir,
      });
      terminal.show();
      terminal.sendText("clear");
      terminal.sendText("dotnet " + filename);
    }
  );
  context.subscriptions.push(runWithDotnet);
}

// This method is called when your extension is deactivated
export function deactivate() {}
