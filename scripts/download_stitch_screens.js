import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '..', 'stitch_screens');

const screens = [
  {
    index: 1,
    id: 'b607ad08720c40ca9569a89f9d3b6395',
    slug: '01_judge_demo',
    title: 'SiteSync AI — 5-Min Judge Demo (Animated)',
    width: 2560,
    height: 2942,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XadhiGw-Ec78T7ZYLpzDfRdsGfU1UQ3iAwPqGFAidtTRcH_OsUeMJm5Ioxv6PId0rB22tZ68zochX7q3DtQZiPcbuuYeVJSqdnpi7t3vqtqiZIIa3c4t5O0Exojuv8YsR2vx0_55mRx-36taaJ-H7hKpk7_3xIoI80SZfQOfyyhP-wccU0WWpjfXEKYecs0_7EPj8PGID0wWKmISRDf2mUYnbDN--zdbiA3Qr9Xx-iqud3QFFeo4xwUQ',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0OTBlYTMyN2EwNTc2MDE0NTc4MDMyZjFiEgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  },
  {
    index: 2,
    id: '62bd536a27ce46baba790249895563b9',
    slug: '02_field_input',
    title: 'SiteSync AI — Field Input Center (Animated)',
    width: 2560,
    height: 5110,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VHaEEIH-7i9Fnhx7cwUn2cHgSaF1ZyXg7sh1aib5169vbRNe0rS6Sy9qdU44z2DypJBVZewit277H0HpD65wp0Uq1j4EUuQsewlXMARC8Rs0JMWxhl5UMbmYXgCT3G4XOSrKNvTJTeifW-T0ibzYVkqtC114po3PUhrYy9uN1IP0d4xTcw2kau4eZFaXL4SP6plZMoTvbBtWckryRN7PbSfcF-eDi8mYv0ezL3JMzleUdaHIEyoTtmTQ',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0OWI0MTM1YTUwMjA3YjhiNGU0Mzg2YjQ1EgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  },
  {
    index: 3,
    id: '730a29765e9f4d7ba4804bc74a47c8d3',
    slug: '03_executive_health',
    title: 'SiteSync AI — Executive Health & S-Curves (Animated)',
    width: 2560,
    height: 4176,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UtvwLJ44yemkiG5USqvw7MKMI7a68hKRw1B4_JVxk4quaeWvhF7PtEwIkW8lDlfABY3pRqzNG_rjS5ukKv1NKEhffdhx3gF0e-aa_4OewLS5PaWBlhuU-9HK_rqucK_tZBAF7QtvsBSBnTExMB4qD1_bJ1tfCMMyLtxkSGBK3RXuTN30oqYxcVkcb4I_HVOxlhi-RtToMStn1LbNf6yM_fd8igcQGssoH8E7ZhqcA2MDBkhA',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0OTA0NGE0N2QwMjJkNTczNzhjMTZkMTQ3EgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  },
  {
    index: 4,
    id: '070dc4891bae40c28618888898bce45c',
    slug: '04_gantt_digital_twin',
    title: 'SiteSync AI — 4D Gantt Digital Twin (Animated)',
    width: 2560,
    height: 2844,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XoD0oZIHDxKYAq97NKovMAaUxzvlyzJgF_IGsdt0XRfgJj4T8iAcD0m4js53DRv1Nn1aJUjtCCisfJb7x8ILo8p9R2s-kF9wvf9-w_7BiiIxSk_v6-7mZdymZUIphfWcuhlA7y32P8nl8agGGJwQFoGF49BilB9y9_vdWUEtbeDaSlvxtMHaOUC7D8R-N0wwrCgW-ZrZtEd0ZHGZ3nCvKF5p90vPmrfTf-7xCU9Ko-UXQFoD9uQpBqsA',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0OWQ5YzMxODcwMzM4NWJkMzhiMWM3YjY0EgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  },
  {
    index: 5,
    id: '81dc2fdd84c044c08356d5e3f3b6c608',
    slug: '05_what_if_simulator',
    title: 'SiteSync AI — What-If Simulator (Animated)',
    width: 2560,
    height: 3944,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UpnGrvNhiVO56x3ZaNbQMJFnmzeMLfq_wGuAtRqo5DG65ChJeei-nfG1blYJ6mtaYnUdd61xPsWefaOvmHOThakkrBOKDVdB536WPAF3rORJ0MJh8jmoTgqHmF406Mby__fPZEpczX7e3LgU59yQEAldmVkpGHNs8-7e6X7FZRS42ztIfHpxdLTd4HDYHD4pbo_GVoj3jReQvKzunfVsnxLYNrCe-3ujBFzPKetv3moxm7j57ihrglyA',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0OWIzMWY1YTYwMjJkNTczNzhjMTZkMTQ3EgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  },
  {
    index: 6,
    id: 'ae9aa655fc22430bbb3791c20f86252c',
    slug: '06_wbs_schedule_tree',
    title: 'SiteSync AI — WBS & Schedule Tree (Animated)',
    width: 2560,
    height: 3064,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1W1oPU5UIysytuamsULIxZNzxTsfVMO1seolr1KrInZTPbUKifervCSgRFlJjOQyjefP5LUBMQyIYdXQoDO9sHllch8dnzO-SeSV_PNo55zHyLTa9kcQWfr74dhA0BCj_k6KjOZttK0gTz8l89EltToBKUZ-a-Kk9fKBicNfrd24az7_ahG1v-0-er1Z6UvScIXhaXo0mX9nV4LsXDytPngtzI5mR-WkZXBmApTCwCHZQzNo-IRuG_iFQ',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0YjAyNDJmMWEwMzM4NWMyNTI4MjcxNTdlEgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  },
  {
    index: 7,
    id: 'c066ec9ffe9049709778615e45d4bf59',
    slug: '07_activity_dna',
    title: 'SiteSync AI — Activity DNA & Memory (Animated)',
    width: 2560,
    height: 3728,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XyAav_3EbcUuBG73FAisvH0DGEhc6N_ISiauaYrI6j4-IRCZPWjzca1TkquiiqBg3dzVBxHicJux6RyHUa9tBQG_5lU1cNO83NPStc0jxtO8MS3pRrhLrygzjzR0X3itEUdzEdMRp-Q8G0MQWz3iOZpiQ-ENd-uu2uvHPJx2pk5XJtFxI2zOuOzets827T00rbJATOXQOv5w62LgNeiIPNdre0wF6JAG4kc44ZE2ZqbR8e_swkiixjzg',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0YWNmYjVmMTAwMzM4NWMyNTI4MjcxNTdlEgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  },
  {
    index: 8,
    id: '619385a15a6943e99dcb28243302e8af',
    slug: '08_audit_provenance',
    title: 'SiteSync AI — Audit & Provenance (Animated)',
    width: 2560,
    height: 3816,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1Xm39R-RKoZW6UnBys6iTbSLyDmFTn4pQdMk6ImmHbG3K7RrKo94y8FqR1QP2DDxY_0I7X9TXhkQg7aAirSP2hYqJvAZF1_9YE1SqQioGeIVmgk34udKUGQQ8s2tk70TND5J6O2Silq9Qb6Grq6zetTqqAnCvqi2H6JRiRByb9FpMCG_igl_bVcr9F5jRHNdNbp4cRWfWzqH94_OU_59vx4vsT6kXTzSjLqmI_YP3TF--eMZN_sOeKINQ',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0YWVlNGE5NzMwNzNhYzhkOWIxMzllZTU1EgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  },
  {
    index: 9,
    id: '0d69d0acccf1488ba36f0657a7213227',
    slug: '09_conflicts_chronology',
    title: 'SiteSync AI — Conflicts & Chronology (Animated)',
    width: 2560,
    height: 4138,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XNjDdCgQHZKEFJlnj-ZSdG9dobVazSAG60c-Suu-xSvIfvfpi8xPtL3BWPaUdF45jb5GOPGmdMOkZ-_JaJNLcEkc_ZHSFt24x4nCdlVItKL0-2kNb2KLuvxWtFDzp4C_Ft9lv53BdWVRlQHptNihRkwGItDOwGmdqtQ2pLXqO_fHiih8tevD9U0z_ImKs7eE2c3ZY_OJ7x1F7fhXIxCneXAKY4OhXbOPKtz3kAiS7ZjFrdoqnmBylC5w',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1Y2I0YWQ4NzkwNzcwN2UwMDQwN2FjMTA5MWMwEgsSBxCzg7i30QQYAZIBIgoKcHJvamVjdF9pZBIUQhIzMjM0OTUzNjgzMzcyMDg2OTE&filename=&opi=89354086'
  }
];

async function downloadFile(url, destPath) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

async function run() {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // Save manifest
  const manifestPath = path.join(baseDir, 'screens_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(screens, null, 2));
  console.log(`Saved manifest to ${manifestPath}`);

  for (const screen of screens) {
    const screenFolder = path.join(baseDir, screen.slug);
    if (!fs.existsSync(screenFolder)) {
      fs.mkdirSync(screenFolder, { recursive: true });
    }

    const imagePath = path.join(screenFolder, 'screenshot.png');
    const htmlPath = path.join(screenFolder, 'screen.html');

    console.log(`Downloading screen ${screen.index}/9: ${screen.title}...`);

    try {
      await downloadFile(screen.imageUrl, imagePath);
      console.log(`  ✓ Image saved -> ${imagePath}`);
    } catch (err) {
      console.error(`  ✗ Image download failed:`, err.message);
    }

    try {
      await downloadFile(screen.htmlUrl, htmlPath);
      console.log(`  ✓ HTML saved -> ${htmlPath}`);
    } catch (err) {
      console.error(`  ✗ HTML download failed:`, err.message);
    }
  }

  console.log('All screens and code downloaded successfully!');
}

run().catch(console.error);
