import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '..', 'stitch_screens', 'dark_mode');

const screens = [
  {
    index: 1,
    id: '6f6fbf36d5f84e6498a4668d17c570dc',
    slug: '01_enterprise_portal_auth',
    title: 'SiteSync AI - Enterprise Portal & Auth (Dark Mode)',
    width: 2560,
    height: 2668,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1X-YOSFBwxiWesUZ3L-1kcIGNCxk1TWjXrdlfjMYmbnpqZU9AHMV_m5eQB-GSpZxO0MUlRmZEqvpJ6RMllZ9WkzMrpJRC0rnHMiQLhIiygMFf5aoHcPCw5DD05r5UIXmihyMLSL6gQqGX2dRpknBMC_qLCnBOLIMCMnNcQxoA13FMbDG0QCD8m9H1oIUOq1i8ouxCENmPChcdiw3KI52Vb1EtnigTY9R5wuuSo3NI7_lrMsCYqRJZXvnmwZ',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1Y2UwNTRiNWNiZjAwNDMxMDNlMDkxMzQ5N2U1EgsSBxCzg7i30QQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDM1NjM4NDMyNjEyOTIzMTM1NA&filename=&opi=89354086'
  },
  {
    index: 2,
    id: '1a631eab151244d5ad784fea68aca9ba',
    slug: '02_field_telemetry_supervisor',
    title: 'SiteSync AI - Field Telemetry & Supervisor Console (Dark Mode)',
    width: 2560,
    height: 4422,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1Uti7UzsdOgGTBFj0ij-VzbB-7prwumtPJkPh_4hrwMjTVZYGV2Mdd_B-nN5IBSV8_PKzQmvnm9kIAmi--k96rY-MvrJTvryPgiOK2jWrUjc8XHLOWOeeoGGxjPUPXId3ctRE9WGUelfaY5pFr3x5L69qNyvpUxX_3gO3wkiNAOORamFWlwSSTflByFy--36RasgdyAklaGMeIPw3qeNoYuKT5cuBszDTKknQmbNZ0DbGp2o4Zf5pfztxg',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1Y2UwNTU0NGE1YjkwNzc5ODQ0ZWY4MDkwMWNmEgsSBxCzg7i30QQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDM1NjM4NDMyNjEyOTIzMTM1NA&filename=&opi=89354086'
  },
  {
    index: 3,
    id: '0db0023972494cf396ed39c102935a86',
    slug: '03_planner_command_dashboard',
    title: 'SiteSync AI - Planner Command Dashboard (Dark Mode)',
    width: 2560,
    height: 3452,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1X6BOTjizqjOOXRALIMAOk7GI2xzQEh7WqnndEP4XcVvF-gY-oLT3gPhdlnwJDvb60YrQRfQdWlQlFBOf8J_QphuF-m8L905JfLptpGgEEc3ZPzZ52TIFfoMsHioTIDHemEQJTmfsNGxAKdBUJc6AIdteE4X4M1Gg_IGSQhcr8eXHH6qx5znIAjVMeB86C4DsMf7eRPwFu56Mxc5ybAipteD5QyFoxvtO-1esYeb5-WOuazOi7qwIFLKfRc',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1Y2UwNTVkYjNiZTUwN2M0ZTdhN2ZiM2E0OGJhEgsSBxCzg7i30QQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDM1NjM4NDMyNjEyOTIzMTM1NA&filename=&opi=89354086'
  },
  {
    index: 4,
    id: '527c0a852fb6400d80814f9713bb199f',
    slug: '04_vigilance_audit_provenance',
    title: 'SiteSync AI - Vigilance Audit & Cryptographic Provenance (Dark Mode)',
    width: 2560,
    height: 3430,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VtNlFBzYIJ6FzrS-SFs7wd3oUZ5WMrgUnzKAV-Hi9D77kMIovX8hfoDMGWJSBfBS7PPE83gNR4ICnZflpDY5u-YIwfTA0ZE22_Z109s-w2ovfqQfM5EJLIJFJi3Gb8q6TCSR2cVP3sCr19ag7KabZyG3TJK_4tj9lVDP31hCUo9_lHv61k_KnNLjrAc8IytnGeYAM4wXPV-Eph8HC1xIPOVqPSldyRKI3jZF5zTiQDM3DR2-frp1jF-Ln6',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1Y2UwNTVjYjg1MDQwNTIyOWNkMmYwMWM0MmYxEgsSBxCzg7i30QQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDM1NjM4NDMyNjEyOTIzMTM1NA&filename=&opi=89354086'
  },
  {
    index: 5,
    id: 'b25678081de84835810b03a8cf779828',
    slug: '05_executive_health_scurves',
    title: 'SiteSync AI - Executive Health S-Curves & Monte Carlo Risk Suite (Dark Mode)',
    width: 2560,
    height: 2552,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1X585fQvp-qspzxeajuqtV7dqRmM12TlBmLRR8vJo_FirnMY6uyy6PEdxcsfES6Q0aj9YklV3SLp8CRdm4MoPlaS0QxNRL0axnfOPa9dlzJk9XPBT5dLXruBiU3EPcBOm2_jTZUgd6rRBvDJWtoxzi3RJZ_frLgBk9m2AVmm-fe0oAYlS3Kas8WTfKxNrgQ2AgCcLlfA68Gm99I3wjHyHhrbSCUJMrGNkzywQRIsmQ-WI5mxXR5a67wWwk',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1Y2UwNjUwMDQwZjAwN2UwMDQwN2FjMTA5MWMwEgsSBxCzg7i30QQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDM1NjM4NDMyNjEyOTIzMTM1NA&filename=&opi=89354086'
  },
  {
    index: 6,
    id: '8ad2c7041a7841d0bf70286d2551229b',
    slug: '06_diagnostics_edge_sync',
    title: 'SiteSync AI - Diagnostics, Edge Architecture & Sync Settings (Dark Mode)',
    width: 2560,
    height: 2792,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XVEFIpbi9mG5ivOmxFnoVaBQ0Pkmdxt0WFiyrCPTm9UNSzgQymF3KaQ6SiXu_WH6Sip9Ejt0stGO7tQ-HeyPGoAl4BSKHOHEtb1ZoSbtBLKwB7S_Dhoy8owWMNQyb6TpYHgy-Dj3TKa0dm0-zerxN7oLemZTtJVJ_LbXmLblR5P7AHv48SnbNAVR_iYYgBVLHxjGE_KOsEtOfw7qNpa2dTYj6l88z2h96sLewBMCKknAcZf7VQvVV9XMie',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1Y2UwNjU0NzkwOTcwNzNhYzhkOWIxMzllZTU1EgsSBxCzg7i30QQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDM1NjM4NDMyNjEyOTIzMTM1NA&filename=&opi=89354086'
  },
  {
    index: 7,
    id: 'c6e5a4f2b9ed4542873ab7b4569a7350',
    slug: '07_overview_command_center',
    title: 'SiteSync AI - Overview Command Center (Dark Mode)',
    width: 2560,
    height: 3262,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VX8KIpPaVc4B-yLpp80UTK8gGSVgcLxBA8bVRybpHBbQrquGvdz5qf9L2czAtRpEOXYzN3TFBdKaDYLCbGZpq9Yl6kAsKbeKuCgghZwRLCIIJW2mDlLMp2Oh3V1Z5DpXgdtQSq8aSZxrJ8SdO4HbAv0_rW1ooyU-Z2QY5p9G8LaAVKnJgYfjl4MGYmbgcDJ5a9JIXhyaEUWP5RSy-rnv-vx4UYVv6P1wWFNPdm6wHmtvKcJ-7dJ-lf3AlR',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1Y2UwNzcxODQ1MWMwMzM4NWVlYmM4MzI4YzcwEgsSBxCzg7i30QQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDM1NjM4NDMyNjEyOTIzMTM1NA&filename=&opi=89354086'
  },
  {
    index: 8,
    id: '9f731410fcb847e085ef9131790a9599',
    slug: '08_eppm_planning_bridge',
    title: 'SiteSync AI - EPPM Planning Bridge & Baseline Suite (Dark Mode)',
    width: 2560,
    height: 3736,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VXiLD4OWyEfr_0XG4FuhB3sR5ovbw5BrrfpVZzqOgIISnnP1fTh0AgW8DSmCIrSs9AlbGE2LP7shOe-ujylYnBKFqEhxEtIwWm28g2E_srcUSSIhD8Nw5BarkCnU05dODFf6FYManGa9mL0_m0qpCuAVNnXISSubmjMx59oYouiWdfTGkrvoqL8f1c-4idrEGtqBBUkPivy6ZZlPAszWszxLSQbGYgdl-vsq7RffX8hBFvGuLmBlaoKZUB',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1Y2UwNzY5MTc2YWIwMjhmMDkzYWEzMmQ1NDVkEgsSBxCzg7i30QQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDM1NjM4NDMyNjEyOTIzMTM1NA&filename=&opi=89354086'
  }
];

async function downloadBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function run() {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const manifest = [];

  for (const s of screens) {
    console.log(`[${s.index}/${screens.length}] Downloading: ${s.title}`);
    const screenDir = path.join(baseDir, s.slug);
    if (!fs.existsSync(screenDir)) {
      fs.mkdirSync(screenDir, { recursive: true });
    }

    const imagePath = path.join(screenDir, 'screen.png');
    const htmlPath = path.join(screenDir, 'screen.html');

    try {
      console.log(`  -> Downloading image...`);
      const imgBuf = await downloadBuffer(s.imageUrl);
      fs.writeFileSync(imagePath, imgBuf);
      console.log(`     Saved image: ${imagePath} (${(imgBuf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  !! Image download error:`, err.message);
    }

    try {
      console.log(`  -> Downloading html...`);
      const htmlBuf = await downloadBuffer(s.htmlUrl);
      fs.writeFileSync(htmlPath, htmlBuf);
      console.log(`     Saved html: ${htmlPath} (${(htmlBuf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  !! HTML download error:`, err.message);
    }

    manifest.push({
      index: s.index,
      id: s.id,
      slug: s.slug,
      title: s.title,
      width: s.width,
      height: s.height,
      imageFile: path.relative(baseDir, imagePath).replace(/\\/g, '/'),
      htmlFile: path.relative(baseDir, htmlPath).replace(/\\/g, '/')
    });
  }

  const manifestPath = path.join(baseDir, 'screens_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\nAll screens downloaded! Manifest written to: ${manifestPath}`);
}

run().catch(console.error);
