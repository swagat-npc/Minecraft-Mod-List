// --- Helpers for links ---
const createFileLinks = (slug, fileId) => {
  const base = `https://www.curseforge.com/minecraft/mc-mods/${slug}`;
  const fileLink = `${base}/files/${fileId}`;
  const downloadLink = `${base}/download/${fileId}`;
  return { fileLink, downloadLink };
};

const createExtLinks = (slug, versionId) => {
  const base = `https://modrinth.com/mod/${slug}`;
  const modPage = `${base}/versions`;
  const versionPage = `${base}/version/${versionId}`;
  return { modPage, versionPage };
};

// --- DOM helpers ---
const clearContainer = (id) => $(`#${id}`).empty();

const generateElement = (tag = "div", className = "", text = "") =>
  $(`<${tag}></${tag}>`).addClass(className).html(text);

const generateAnchor = (text, href) =>
  $("<a></a>").attr({ href, target: "_blank" }).text(text);

const buildRow = (nameEl, versionEl, linkEl) =>
  generateElement("div", "row mod-row").append(nameEl, versionEl, linkEl);

// --- Sorting ---
const sortByName = (list) => list.sort((a, b) => a.name.localeCompare(b.name));

// --- Main data ---
let masterData = {};
const currentVersion = "1.21.5";

// --- Manage mod list (fabric mods) ---
const manageList = (mods, version) => {
  clearContainer("fabric-mods");

  const sortedMods = sortByName(mods);

  sortedMods.forEach((mod) => {
    const name = generateElement("div", "col-4 mod-name", mod.name);
    const versionEl = generateElement("div", "col-4 mod-version", mod.version);
    const linkEl = generateElement("div", "col-4 mod-link");

    const { fileLink, downloadLink } = createFileLinks(mod.slug, mod.cf);

    linkEl.append(generateAnchor("List", fileLink))
          .append("<br>")
          .append(generateAnchor("File", fileLink))
          .append("<br>")
          .append(generateAnchor("Download", downloadLink));

    if (mod.mrSlug && mod.mrVersion) {
      const { modPage, versionPage } = createExtLinks(mod.mrSlug, mod.mrVersion);
      const extLink = generateElement("a", "ext-link", `v${mod.mrVersion}`)
        .attr({ title: "Modrinth Version", target: "_blank", href: versionPage });
      name.append(extLink);
    }

    if (mod.version !== version) {
      versionEl.css("color", "red");
    }

    const row = buildRow(name, versionEl, linkEl);
    $("#fabric-mods").append(row);
  });
};

// --- Manage Resource / Shader Packs ---
const generatePacks = (type, packs, version) => {
  clearContainer(`${type}-packs`);

  const sortedPacks = sortByName(packs);

  sortedPacks.forEach((pack) => {
    const name = generateElement("div", "col-4 mod-name", pack.name);
    const versionEl = generateElement("div", "col-4 mod-version", pack.version);
    const linkEl = generateElement("div", "col-4 mod-link");

    const { fileLink, downloadLink } = createFileLinks(pack.slug, pack.cf);

    linkEl.append(generateAnchor("List", fileLink))
          .append("<br>")
          .append(generateAnchor("Download", downloadLink));

    if (pack.version !== version) {
      versionEl.css("color", "red");
    }

    const row = buildRow(name, versionEl, linkEl);
    $(`#${type}-packs`).append(row);
  });
};

// --- Handle version change ---
const changeVersion = (version) => {
  const banner = masterData.banners[version] || "banner.png";
  $(".game-header-art").css("background-image", `url(./img/${banner})`);

  // Build mod list for current version
  const mods = masterData.modList.flatMap((mod) => {
    const file = mod.files.find(f => f.version === version);
    if (!file) return [];

    return {
      name: mod.name,
      slug: mod.curseforge,
      version: file.version,
      cf: file.cf,
      mrSlug: mod.modrinth,
      mrVersion: file.mr
    };
  });

  const resources = masterData.resourcePacks.flatMap((pack) => {
    const file = pack.files.find(f => f.version === version);
    if (!file) return [];

    return {
      name: pack.name,
      slug: pack.curseforge,
      version: file.version,
      cf: file.cf
    };
  });

  const shaders = masterData.shaderPacks.flatMap((pack) => {
    const file = pack.files.find(f => f.version === version);
    if (!file) return [];

    return {
      name: pack.name,
      slug: pack.curseforge,
      version: file.version,
      cf: file.cf
    };
  });

  manageList(mods, version);
  generatePacks("resource", resources, version);
  generatePacks("shader", shaders, version);
};

// --- Init when document ready ---
$(() => {
  fetch('./js/mods.json')
    .then(res => res.json())
    .then(data => {
      masterData = data;

      const versions = [...new Set(
        masterData.modList.flatMap(mod => mod.files.map(f => f.version))
      )].sort();

      const select = $("#version").empty();

      versions.forEach(v => {
        select.append(`<option value="${v}">${v}${v === currentVersion ? " (Current)" : ""}</option>`);
      });

      select.val(currentVersion);
      select.change(function () {
        changeVersion(this.value);
      });

      changeVersion(currentVersion);
    })
    .catch(err => console.error("Failed to load mods.json", err));
});
