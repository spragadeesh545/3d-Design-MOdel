# 🧱 3D Wall Builder

A web-based 3D wall design and visualization tool built using **React, TypeScript, Three.js, and React Three Fiber**.

The application allows users to enter wall dimensions such as **length, width, and height** and instantly visualize the wall as an interactive 3D model.

## 🌐 Live Demo

🚀 **[Open 3D Wall Builder](https://spragadeesh545.github.io/3d-Design-MOdel/)**

## 📌 Project Overview

Designing a wall using only numerical measurements can make it difficult to understand its actual size and appearance.

The **3D Wall Builder** provides a simple visual solution. Users can enter the required wall dimensions, and the application generates a corresponding 3D wall that can be viewed, rotated, and inspected directly in the browser.

### Example

If the user enters:

```text
Length : 10 ft
Width  : 0.3 ft
Height : 8 ft
```

the application generates a 3D representation of the wall based on these dimensions.

## ✨ Features

* 📐 Enter custom wall dimensions
* 🧱 Generate a 3D wall automatically
* 🔄 Rotate the 3D wall
* 🔍 Zoom and inspect the model
* 🖱️ Interactive 3D controls
* ⚡ Fast browser-based visualization
* 🌐 No additional software installation required
* 📱 Simple and user-friendly interface
* 🚀 Hosted using GitHub Pages

## 🏗️ Application Workflow

```text
        User
          │
          ▼
  Enter Wall Dimensions
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
 Length  Width  Height
    │     │     │
    └─────┼─────┘
          ▼
   Validate Dimensions
          │
          ▼
    Generate 3D Wall
          │
          ▼
 Interactive 3D Model
          │
     ┌────┼────┐
     ▼    ▼    ▼
   Rotate Zoom Inspect
```

## 🛠️ Technologies Used

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| React             | User interface                  |
| TypeScript        | Type-safe development           |
| Vite              | Development and build tool      |
| Three.js          | 3D rendering                    |
| React Three Fiber | Three.js integration with React |
| React Three Drei  | 3D helper components            |
| Git               | Version control                 |
| GitHub            | Source code hosting             |
| GitHub Pages      | Website deployment              |

## 📂 Project Structure

```text
3d-Design-MOdel/
│
├── public/
│
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
│
├── dist/
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/spragadeesh545/3d-Design-MOdel.git
```

### 2. Open the project

```bash
cd 3d-Design-MOdel
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

The production files will be generated inside:

```text
dist/
```

## 🌍 Deployment

The project is deployed using **GitHub Pages**.

### Live Website

👉 **https://spragadeesh545.github.io/3d-Design-MOdel/**

The project uses the following Vite base path for GitHub Pages:

```text
/3d-Design-MOdel/
```

## 🔄 Updating the Deployment

After making changes to the project:

```bash
npm run build
```

Then update the GitHub Pages deployment using the deployment branch.

```bash
git subtree split --prefix dist -b gh-pages-deploy
git push origin gh-pages-deploy:gh-pages --force
git branch -D gh-pages-deploy
```

## 🎯 Project Objectives

The main objectives of this project are:

1. Convert numerical wall dimensions into a visual 3D representation.
2. Make basic wall visualization easier for users.
3. Provide an interactive browser-based 3D experience.
4. Reduce the difficulty of understanding dimensions through visualization.
5. Create a foundation that can be extended into a complete 3D floor-plan system.

## 🔮 Future Enhancements

The project can be extended with several useful features:

* 🧱 Multiple connected walls
* 🏠 Complete 3D room creation
* 🚪 Door placement
* 🪟 Window placement
* 📏 Real-time measurement labels
* 🎨 Wall materials and textures
* 🧩 Tile visualization
* 🛋️ Furniture placement
* 💾 Save and load designs
* 📤 Export designs
* 📦 3D model export
* 📱 Improved mobile responsiveness
* 👥 User accounts and cloud storage

## 💡 Future Vision

The current project focuses on generating a **single 3D wall from user-provided dimensions**.

The long-term goal is to extend the application into an interactive **3D floor-plan and interior visualization platform**, where users can create rooms, connect walls, add doors and windows, apply materials, and visualize designs before implementation.

```text
Single Wall
     ↓
Multiple Walls
     ↓
Complete Room
     ↓
3D Floor Plan
     ↓
Interior Visualization
```

## 📸 Demo

Visit the live application to interact with the 3D wall:

👉 **[Launch 3D Wall Builder](https://spragadeesh545.github.io/3d-Design-MOdel/)**

## 👨‍💻 Developer

**Pragadeesh**

GitHub: **[spragadeesh545](https://github.com/spragadeesh545)**

## 📄 License

This project is open-source and intended for learning, development, and experimentation.

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Repository:**
https://github.com/spragadeesh545/3d-Design-MOdel

**Live Demo:**
https://spragadeesh545.github.io/3d-Design-MOdel/
