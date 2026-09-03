# Cross-Browser Compatibility Matrix

## 1. Supported Browser Engines & Configurations

| Browser | Supported Versions | OS Platforms | Rendering Engine | Headless Mode in CI | Automation Driver | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Chrome** | Latest 3 versions (v120+) | Windows, macOS, Linux | Blink / V8 | `--headless=new` | ChromeDriver | **TIER 1 (FULL SUPPORT)** |
| **Microsoft Edge** | Latest 3 versions (v120+) | Windows, macOS, Linux | Chromium | `--headless=new` | EdgeDriver | **TIER 1 (FULL SUPPORT)** |
| **Mozilla Firefox** | Latest 3 versions (v125+) | Windows, macOS, Linux | Gecko / SpiderMonkey | `-headless` | GeckoDriver | **TIER 1 (FULL SUPPORT)** |
| **Apple Safari** | Latest 2 versions (v17+) | macOS, iOS | WebKit | Native / SFSafari | SafariDriver | **TIER 2 (VERIFIED)** |

---

## 2. Responsive Breakpoint Validation

* **Desktop (Full HD):** `1920 x 1080` (Primary CI target)
* **Laptop:** `1440 x 900`
* **Tablet (iPad):** `768 x 1024`
* **Mobile (iPhone 14 / Pixel 7):** `390 x 844`
