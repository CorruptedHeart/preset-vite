import { execFile } from "node:child_process";
import { test } from "node:test";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import assert from "node:assert";
import { dir } from "./util.mjs";

const execFileAsync = promisify(execFile);

test("builds demo successfully", async () => {
	// Should complete without throwing an error
	await execFileAsync(
		process.execPath,
		[dir("node_modules/vite/bin/vite.js"), "build"],
		{ cwd: dir("demo"), encoding: "utf8" },
	);

	const outputHtml = await fs.readFile(dir("demo/dist/index.html"), "utf-8");
	assert.match(outputHtml, /lang="en"/);                        // Checks head.lang
	assert.match(outputHtml, /Prerendered Preact App/);           // Checks head.title
	assert.match(outputHtml, /This is a prerendered Preact app/); // Checks head.elements
	assert.match(outputHtml, /Hello from Preact/);                // Checks body

	assert.doesNotThrow(async () => await fs.access(dir("demo/dist/404/index.html")));
});
