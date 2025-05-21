import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Material Icons CSS
const materialIconsLink = document.createElement("link");
materialIconsLink.rel = "stylesheet";
materialIconsLink.href = "https://fonts.googleapis.com/css2?family=Material+Icons&display=swap";
document.head.appendChild(materialIconsLink);

// Inter font CSS
const interFontLink = document.createElement("link");
interFontLink.rel = "stylesheet";
interFontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
document.head.appendChild(interFontLink);

// Add title element
const titleElement = document.createElement("title");
titleElement.textContent = "Voice Transcriber - AssemblyAI";
document.head.appendChild(titleElement);

createRoot(document.getElementById("root")!).render(<App />);
