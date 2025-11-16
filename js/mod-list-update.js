// --- Helpers for links ---
const createFileLinks = (slug, fileId) => {
  const base = `https://www.curseforge.com/minecraft/mc-mods/${slug}`;
  const listLink = `${base}/files`;
  const fileLink = `${base}/files/${fileId}`;
  const downloadLink = `${base}/download/${fileId}`;
  return { listLink, fileLink, downloadLink };
};

const createExtLinks = (slug, versionId) => {
  const base = `https://modrinth.com/mod/${slug}`;
  const listLink = `${base}/versions`;
  const fileLink = `${base}/version/${versionId}`;
  return { listLink, fileLink };
};

// --- DOM helpers ---
const clearContainer = (id) => $(`#${id}`).empty();

const generateElement = (tag = "div", className = "", text = "") => 
  $(`<${tag}></${tag}>`).addClass(className).html(text);

const buildRow = (nameEl, versionEl, linkEl) => 
  generateElement("div", "row mod-row").append(nameEl, versionEl, linkEl);

const generateAnchors = (fileLink, fileUrl, downloadUrl) => [
  generateElement("a", "", "List").attr({ target: "_blank", href: fileLink }),
  generateElement("a", "", "File").attr({ target: "_blank", href: fileUrl }),
  generateElement("a", "", "Download").attr({ target: "_blank", href: downloadUrl }),
];

// --- Sorting ---
const sortByName = (list) => list.sort((a, b) => a.name.localeCompare(b.name));

// --- Main data ---
let masterData = {};
const currentVersion = "1.21.5";

// Manage the mod list display
const manageList = (mods, version) => {
  clearContainer("fabric-mods");

  const sortedList = sortByName(mods);

  sortedList.forEach((mod) => {
    const { listLink, fileLink, downloadLink } = createFileLinks(mod.link);

    const name = generateElement("div", "col-4 mod-name", mod.name);
    if (mod.ext) {
      const externalLink = generateElement("a", "ext-link", mod.extver ? `v${mod.extver}` : "EXT")
        .attr({
          title: `Modrinth (v${mod.version})`,
          target: "_blank",
          href: mod.extlink ?? mod.ext,
        });

      if (mod.extver !== includeVersion) externalLink.css("color", "red");
      name.append(externalLink);
    }

    const version = generateElement("div", "col-4 mod-version", mod.version);
    if (mod.version !== includeVersion) version.css("color", "red");

    const link = generateElement("div", "col-4 mod-link").append(
      ...generateAnchors(fileLink, mod.link, downloadLink)
    );

    const row = buildRow(name, version, link);
    $("#fabric-mods").append(row);
  });
};

// Manage resource or shader packs
const generatePacks = (type, list, includeVersion) => {
  if (!list) return;
  const sortedList = sortByName(list);

  clearContainer(`${type}-packs`);

  sortedList.forEach((pack) => {
    const { fileLink, downloadLink } = createFileLinks(pack.link);

    const name = generateElement("div", "col-4 mod-name", pack.name);
    const version = generateElement("div", "col-4 mod-version", pack.version);
    if (pack.version !== includeVersion) version.css("color", "red");

    const link = generateElement("div", "col-4 mod-link").append(
      ...generateAnchors(fileLink, pack.link, downloadLink)
    );

    const row = buildRow(name, version, link);
    $(`#${type}-packs`).append(row);
  });
};

// Generate additional external links section
const generateAdditionalLinks = () => {
  clearContainer("additional-links");

  additional_links.forEach((entry) => {
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
};

// Handle version change
const changeVersion = (version) => {
  const fileVar = getFileVar(version);
  const jsonData = window[fileVar];

  $(".game-header-art").css("background-image", `url(./img/${jsonData.banner ?? 'banner.png'})`);
  manageList(jsonData.modList, version);
  generatePacks("resource", jsonData.resourcePacks, version);
  generatePacks("shader", jsonData.shaderPacks, version);
};

// Get file variable name based on version
const getFileVar = (version) => `list_${version.replaceAll(".", "")}`;

// Initialize when document is ready
$(() => {
  $("#version").change(function () {
    changeVersion(this.value);
  });

  changeVersion(currentVersion);
  generateAdditionalLinks();
});
