import React, { useState } from 'react';

const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween",
  "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
  "wireframe", "black", "luxury", "dracula", "cmyk",
  "autumn", "business", "acid", "lemonade", "night",
  "coffee", "winter", "dim", "nord", "sunset"
];

const Settings = () => {
  const [selectedTheme, setSelectedTheme] = useState("retro");

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setSelectedTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Settings</h1>
      <label className="block mb-2">Select Theme:</label>
      <select
        value={selectedTheme}
        onChange={handleThemeChange}
        className="select select-bordered mb-4"
      >
        {themes.map(theme => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
      <div className={`preview p-4 rounded border ${selectedTheme}`}>
        <h2 className="text-lg font-semibold">Preview</h2>
        <p>This is a preview of the {selectedTheme} theme.</p>
      </div>
    </div>
  );
};

export default Settings;
