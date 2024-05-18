import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";
import { config } from "../../config.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const projectRoot = config.__dirname;

export async function createSandbox({ sandbox_id, data, js_code }) {
  const sandboxDir = path.join(projectRoot, "sandbox", sandbox_id);

  // Step 1: Create the sandbox directory
  await fs.promises.mkdir(sandboxDir, { recursive: true });

  // Step 2: Write js_code to index.js within the sandbox directory
  await fs.promises.writeFile(path.join(sandboxDir, "index.js"), js_code);

  // Step 3: Write data to data.js
  const dataString = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  const finalData = `export const DATA = ${dataString};\n\nexport const sandbox_id = "${sandbox_id}";`;
  await fs.promises.writeFile(path.join(sandboxDir, "data.js"), finalData);
  return sandboxDir;
}

export async function createSandboxAndRun({ data, js_code }) {
  const sandbox_id = uuidv4();
  const sandboxDir = await createSandbox({ sandbox_id, data, js_code });
  // Step 4: Run the sandbox
  const command = `node ${path.join(sandboxDir, "index.js")}`;
  await new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });

  // Step 5: Check if the output file exists
  const outputFilePath = path.join(sandboxDir, "output.png");
  if (fs.existsSync(outputFilePath)) {
    console.log("Output file created:", outputFilePath);
  } else {
    console.error("Output file not found");
  }

  // Step 6: Copy the output file to the public folder, with the name of the sandbox_id
  const publicDir = path.join(projectRoot, "public");
  const fileName = `${sandbox_id}.png`;
  fs.copyFileSync(outputFilePath, path.join(publicDir, fileName));

  return `/${fileName}`;
}
