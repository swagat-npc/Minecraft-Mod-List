# Fabric Mod List Manager

A simple web app to display my personal collection of Minecraft Fabric mods, resource packs, and shader packs I use for different game versions.

### Supported Versions
- **1.21.4**
- **1.21.5**
- **1.21.10**

<details>
  <summary>Previously Supported Versions</summary>

These versions were supported before a recent refactor.  
They might be reintroduced later depending on demand.

- 1.18.2
- 1.19.2
- 1.19.3
- 1.20.1
- 1.20.4

</details>

---

### 🚀 Running Locally

This project uses a simple `Node.js` server to avoid `CORS` issues when fetching `JSON` files.

#### Requirements
- Node.js installed
- (First time only) Install http-server:

```bash
npm install -g http-server
```

#### Running the project
- Open terminal in the project folder
- Run:
  ```bash
  npm start
  ```
- Open your browser and navigate to:
  ```arduino
  http://localhost:8000/
  ```

####  Notes
- You must use a local server to fetch JSON (`mods.json`) properly.
- Opening `index.html` directly with `file://` will NOT work due to CORS restrictions.

---

### 📦 Project Structure

- `mod-list.js` → Main logic to load and display mods/resource/shader packs/additional links.
- `mods.json` → JSON variables that contain the actual mod data for each version.

<details>
  <summary>Deprecated Implementation</summary>

  - `list_*.js` → JSON-like variables that contain the actual mod data for each version (e.g., `list_1215`, `list_1202`, etc.).
  
</details>

---

### 🚀 How to Update Mods / Versions

#### 1. Add a New Game Version
- Open the `mods.json` file.
  - It has the following structure:  
    ```javascript
    {
      modList: [...],
      resourcePacks: [...],
      shaderPacks: [...],
      banners: {...}
    };
    ```
- Add a new entry with the new version for each item, based on the mod's URL
  - Example (Irish Shader Mod for version 1.21.10): 
    - Curseforge link:
    
        https:&#8203;//www.curseforge.com/minecraft/mc-mods/`irisshaders`/files/`7088028`
    - Modrinth link:
     
        https:&#8203;//modrinth.com/mod/`iris`/version/`1.9.6+1.21.10-fabric`
     
    ```json
    {
      "name": "Iris Shaders",
      "curseforge": "irisshaders", // name in the respective url
      "modrinth": "iris", // name in the respective url
      "files": [
        { ... },
        { "version": "1.21.10", "cf": "7088028", "mr": "1.9.6+1.21.10-fabric" } // new version, new links
      ]
    },
    ```

#### 2. Update Versions
- The version list in the webpage dropdown will auto update based on the `mods.json` file, so no need to add the version anywhere manually.
- Update the `currentVersion` variable in the `mod-list.js` file, so the the dropdown in the webpage defaults to it on load:
  ```javascript
  const currentVersion = "1.21.10";
  ```

#### 3. Update Banner for clarity
- Add a new image on the `img` folder to go with your new version.
- Follows the pattern to add a new banner in the `banners` variable inside `mods.json`.

#### 4. (Optional) Update Additional Links
- To add links like external sites or documents, edit the `additional_links` array:

    ```javascript
    const additional_links = [
      {
        name: "Useful Tools",
        links: [
          { title: "Modrinth", url: "https://modrinth.com/" },
          { title: "CurseForge", url: "https://curseforge.com/" }
        ]
      }
    ];
    ```

---

### ✨ Development Notes

- All list data is handled manually for simplicity.
- Sorting is automatic (alphabetical by mod/resource name).
- External version links are highlighted **red** if they mismatch the current version.

---

### 📋 To-Do

- [X] Optimize how game versions are handled.
- [ ] Add support for older versions that were already present.
- [ ] Add a "Last updated" date on the page.
- [ ] Migrate to native JavaScript (remove jQuery) in the future if needed.

---

### 🧙‍♂️ Tips for Maintenance

- Keep file links organized.
- Double-check the `download/` path generation when adding new mods.
- Keep mod names consistent to avoid sort weirdness.

---

# Screenshots
![Main Page](img/website.png)