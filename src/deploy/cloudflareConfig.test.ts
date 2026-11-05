import { describe, expect, it } from "vitest";
import deployWorkflow from "../../.github/workflows/deploy.yml?raw";
import wranglerText from "../../wrangler.jsonc?raw";

type WranglerConfig = {
  name: string;
  compatibility_date: string;
  main?: string;
  assets: {
    directory: string;
    not_found_handling: string;
  };
};

function stripJsonComments(source: string): string {
  let result = "";
  let index = 0;
  let inString = false;
  let escaped = false;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (inString) {
      result += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      index += 1;
      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      index += 1;
      continue;
    }

    if (char === "/" && next === "/") {
      index += 2;
      while (index < source.length && source[index] !== "\n") {
        index += 1;
      }
      continue;
    }

    if (char === "/" && next === "*") {
      index += 2;
      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        index += 1;
      }
      index += 2;
      continue;
    }

    result += char;
    index += 1;
  }

  return result;
}

describe("cloudflare deploy config", () => {
  it("describes an assets-only SPA worker", () => {
    const config = JSON.parse(stripJsonComments(wranglerText)) as WranglerConfig;
    expect(config.name).toBe("tactile");
    expect(config.compatibility_date).toBe("2026-11-05");
    expect(config.assets.directory).toBe("./dist");
    expect(config.assets.not_found_handling).toBe("single-page-application");
    expect(config.main).toBeUndefined();
  });

  it("deploys with repository secrets and no literal tokens", () => {
    expect(deployWorkflow).toContain("${{ secrets.CLOUDFLARE_API_TOKEN }}");
    expect(deployWorkflow).toContain("${{ secrets.CLOUDFLARE_ACCOUNT_ID }}");

    const lines = deployWorkflow.split("\n");
    expect(lines.some((line) => line.trim() === "apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}")).toBe(true);
    expect(lines.some((line) => line.trim() === "accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}")).toBe(true);

    const typecheckAt = deployWorkflow.indexOf("npm run typecheck");
    const testAt = deployWorkflow.indexOf("npm test");
    const buildAt = deployWorkflow.indexOf("npm run build");
    const deployAt = deployWorkflow.indexOf("cloudflare/wrangler-action@");
    expect(typecheckAt).toBeGreaterThan(-1);
    expect(testAt).toBeGreaterThan(typecheckAt);
    expect(buildAt).toBeGreaterThan(testAt);
    expect(deployAt).toBeGreaterThan(buildAt);
    expect(deployWorkflow).not.toMatch(/continue-on-error:\s*true/);
    expect(deployWorkflow).not.toMatch(/\becho\b[^\n]*\bsecrets\b/);

    const withoutSecrets = deployWorkflow
      .replaceAll("${{ secrets.CLOUDFLARE_API_TOKEN }}", "")
      .replaceAll("${{ secrets.CLOUDFLARE_ACCOUNT_ID }}", "");
    expect(withoutSecrets).not.toMatch(/apiToken:\s*['"][^'"]+['"]/);
    expect(withoutSecrets).not.toMatch(/accountId:\s*['"][^'"]+['"]/);
    expect(withoutSecrets).not.toMatch(/['"][A-Za-z0-9+/=_-]{20,}['"]/);
    expect(withoutSecrets).not.toMatch(/\b(?:cfut|cfat|cfoa|cfk)_[A-Za-z0-9_-]+\b/);
    expect(withoutSecrets).not.toMatch(/\b[a-f0-9]{32}\b/i);
  });
});
