// --- Helpers for links ---
const createFileLinks = (slug, fileId, minecraftVersion) => {
  const base = `https://www.curseforge.com/minecraft/mc-mods/${slug}`;
  const listLink = `${base}/files/all?page=1&pageSize=20&version=${minecraftVersion}&gameVersionTypeId=4&showAlphaFiles=hide`;
  const fileLink = `${base}/files/${fileId}`;
  const downloadLink = `${base}/download/${fileId}`;
  return { fileLink, listLink, downloadLink };
};

const createExtLinks = (slug, versionId, minecraftVersion) => {
  const base = `https://modrinth.com/mod/${slug}`;
  const modPage = `${base}/versions?g=${minecraftVersion}&l=fabric`;
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
const currentVersion = "1.21.10";

// --- Manage mod list (fabric mods) ---
const manageList = (mods, version) => {
  clearContainer("fabric-mods");

  const sortedMods = sortByName(mods);

  sortedMods.forEach((mod) => {
    const name = generateElement("div", "col-4 mod-name", mod.name);
    const versionEl = generateElement("div", "col-4 mod-version", mod.version);
    const linkEl = generateElement("div", "col-4 mod-link");

    const { fileLink, listLink, downloadLink } = createFileLinks(mod.slug, mod.cf, version);

    linkEl.append(generateAnchor("List", listLink))
          .append("<br>")
          .append(generateAnchor("File", fileLink))
          .append("<br>")
          .append(generateAnchor("Download", downloadLink));

    if (mod.mrSlug && mod.mrVersion) {
      const { versionPage } = createExtLinks(mod.mrSlug, mod.mrVersion, version);
      const extLink = generateElement("a", "ext-link", `v${version}`)
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

    const { listLink, downloadLink } = createFileLinks(pack.slug, pack.cf, version);

    linkEl.append(generateAnchor("List", listLink))
          .append("<br>")
          .append(generateAnchor("Download", downloadLink));

    if (pack.version !== version) {
      versionEl.css("color", "red");
    }

    const row = buildRow(name, versionEl, linkEl);
    $(`#${type}-packs`).append(row);
  });
};

// Generate additional external links section
const generateAdditionalLinks = () => {
  clearContainer("additional-links");
  
  fetch('./js/additional-links.json')
    .then(res => res.json())
    .then(data => {
      const links = data.additionalLinks;

      links.forEach((entry) => {
        const name = generateElement("div", "col-6 mod-name", entry.name);
        const linkContainer = generateElement("div", "col-6 mod-link");

        entry.links.forEach((link, index) => {
          linkContainer.append(
            generateElement("a", "", link.title).attr({ target: "_blank", href: link.url })
          );
          if (index < entry.links.length - 1) {
            linkContainer.append($("<br/>"));
          }
        });

        const row = buildRow(name, linkContainer);
        $("#additional-links").append(row);
      });
    })
    .catch(err => console.error("Failed to load additional-links.json", err));  
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
      )].sort((a, b) => {
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
          const na = pa[i] || 0;
          const nb = pb[i] || 0;
          if (na !== nb) return na - nb;
        }
        return 0;
      });

      const select = $("#version").empty();

      versions.forEach(v => {
        select.append(`<option value="${v}">${v}${v === currentVersion ? " (Current)" : ""}</option>`);
      });

      select.val(currentVersion);
      select.change(function () {
        changeVersion(this.value);
      });

      changeVersion(currentVersion);
      generateAdditionalLinks();
    })
    .catch(err => console.error("Failed to load mods.json", err));
});
