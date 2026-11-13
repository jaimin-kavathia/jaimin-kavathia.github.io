/**
 * Tells IndexNow (Bing, and the search engines that share its feed) to
 * re-crawl every page in the live sitemap. Run by the Deploy workflow once
 * the site is published.
 *
 *   node .github/scripts/indexnow.mjs <site-url> [--dry-run]
 *
 * The key is the file public/<key>.txt, whose content is its own name.
 * IndexNow reads that file from the live site to confirm the request comes
 * from the site's owner, so it has to be deployed before the first run.
 */
import { readdir, readFile } from 'node:fs/promises';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const PUBLIC_DIR = new URL('../../public/', import.meta.url);
const KEY_FILE = /^([A-Za-z0-9-]{8,128})\.txt$/;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const siteUrl = args.find((arg) => !arg.startsWith('--'));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** A just-deployed file can take a few seconds to reach the CDN. */
async function fetchText(url, attempts = 6) {
  let problem = '';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.text();
      problem = `HTTP ${response.status}`;
    } catch (error) {
      problem = error.message;
    }
    if (attempt < attempts) await sleep(5000);
  }
  throw new Error(`Could not read ${url} (${problem})`);
}

async function findKey() {
  for (const name of await readdir(PUBLIC_DIR)) {
    const key = name.match(KEY_FILE)?.[1];
    if (key && (await readFile(new URL(name, PUBLIC_DIR), 'utf8')).trim() === key) return key;
  }
  throw new Error('No IndexNow key file in public/ (expected <key>.txt containing the key)');
}

async function main() {
  if (!siteUrl) throw new Error('Usage: node .github/scripts/indexnow.mjs <site-url> [--dry-run]');

  const key = await findKey();
  const sitemap = await fetchText(new URL('sitemap.xml', siteUrl), dryRun ? 1 : 6);
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  if (urlList.length === 0) throw new Error('The sitemap lists no pages');

  const { origin, host } = new URL(urlList[0]);
  const foreign = urlList.filter((url) => new URL(url).host !== host);
  if (foreign.length > 0) throw new Error(`Sitemap mixes hosts: ${foreign.join(', ')}`);

  const keyLocation = `${origin}/${key}.txt`;
  const body = { host, key, keyLocation, urlList };

  if (dryRun) {
    console.log(`Dry run. Would POST to ${ENDPOINT}:`);
    console.log(JSON.stringify(body, null, 2));
    const live = await fetchText(keyLocation, 1).catch(() => '');
    console.log(live.trim() === key ? 'Key file is live.' : 'Key file is not live yet.');
    return;
  }

  // Without the live key file IndexNow answers 403, so wait for it first.
  if ((await fetchText(keyLocation)).trim() !== key) {
    throw new Error(`${keyLocation} does not contain the key`);
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // 200: accepted. 202: accepted, key check still pending.
  if (response.status !== 200 && response.status !== 202) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`IndexNow answered HTTP ${response.status} ${detail}`.trim());
  }
  console.log(`IndexNow accepted ${urlList.length} URLs for ${host} (HTTP ${response.status}).`);
  for (const url of urlList) console.log(`  ${url}`);
}

main().catch((error) => {
  console.error(`IndexNow: ${error.message}`);
  process.exitCode = 1;
});
