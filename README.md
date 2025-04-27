# Fabric Mod List Manager

A simple web app to display my personal collection of Minecraft Fabric mods, resource packs, and shader packs I use for different game versions.
Currently this includes the following Minecraft Versions:
- 1.18.2
- 1.19.2
- 1.19.3
- 1.20.1
- 1.20.4
- 1.21.4
- 1.21.5

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

- `mod-list.js` → Main logic to load and display mods/resource/shader packs.
- `list_*.js` → JSON-like variables that contain the actual mod data for each version (e.g., `list_1215`, `list_1202`, etc.).

---

### 🚀 How to Update Mods / Versions

#### 1. Add a New Game Version
- Create a new variable in your `list_*.js` file.
  - Example:  
    ```javascript
    var list_1220 = {
      banner: "path/to/banner.png",
      modList: [...],
      resourcePacks: [...],
      shaderPacks: [...]
    };
    ```
- Make sure the variable name matches the pattern:  
  `list_` + version number with no dots (e.g., `1.22.0` → `list_1220`).

#### 2. Update Version Dropdown
- Update the `<select>` element in HTML to add the new version:
  ```html
  <option value="1.22.0">1.22.0</option>
  ```
- Update the `currentVersion` variable in `mod-list.js` with this new version.

#### 3. Update Banner for clarity
- Add a new image on the `img` folder to go with your new version.
- Follows the pattern `banner-` + version number with no dots (e.g., `1.22.0` → `banner-1220.jpg`).

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

- [ ] Migrate to native JavaScript (remove jQuery) in the future if needed.
- [ ] Add a "Last updated" date on the page.
- [ ] Optimize how game versions are handled.

---

### 🧙‍♂️ Tips for Maintenance

- Keep file links organized.
- Double-check the `download/` path generation when adding new mods.
- Keep mod names consistent to avoid sort weirdness.

---

# Screenshots
![Main Page](img/website.png)