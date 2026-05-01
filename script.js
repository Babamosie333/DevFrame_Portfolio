class TerminalResume {
  constructor() {
    this.output = document.getElementById("output");
    this.input = document.getElementById("command-input");
    this.terminal = document.querySelector(".terminal");
    this.terminalContainer = document.querySelector(".terminal-container");

    this.themeModal = document.getElementById("theme-modal");
    this.projectsModal = document.getElementById("projects-modal");
    this.skillsModal = document.getElementById("skills-modal");
    this.themeToggle = document.getElementById("theme-toggle");

    this.currentTheme = localStorage.getItem("theme") || "default";
    this.matrixInterval = null;

    this.projects = [
      {
        title: "3D Portfolio",
        description:
          "A modern interactive portfolio with creative UI and immersive visual elements.",
        technologies: ["Next.js", "React", "Tailwind CSS", "Spline"],
        link: "https://github.com/Babamosie333",
      },
      {
        title: "BCA MCQ Hub",
        description:
          "A quiz platform for BCA students with subject-wise MCQs and practice features.",
        technologies: ["HTML", "CSS", "JavaScript"],
        link: "https://github.com/Babamosie333",
      },
      {
        title: "Real-Time Chat App",
        description:
          "A chat application for interactive messaging and real-time communication.",
        technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
        link: "https://github.com/Babamosie333",
      },
      {
        title: "BabaGallery",
        description:
          "A gallery application with clean UI and media management features.",
        technologies: ["Next.js", "Tailwind CSS", "Cloudinary"],
        link: "https://github.com/Babamosie333",
      },
      {
        title: "Babazon",
        description:
          "An e-commerce project inspired by modern online shopping platforms.",
        technologies: ["React", "Node.js", "MongoDB"],
        link: "https://github.com/Babamosie333",
      },
      {
        title: "Memory Game",
        description:
          "A browser-based game focused on interaction, matching logic, and UI polish.",
        technologies: ["HTML", "CSS", "JavaScript"],
        link: "https://github.com/Babamosie333",
      },
    ];

    this.skills = {
      Frontend: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
      ],
      Backend: ["Node.js", "MongoDB", "SQL", "Django", "Flask"],
      Languages: ["JavaScript", "TypeScript", "Python", "C", "C++"],
      Tools: ["GitHub", "Vercel", "VS Code", "Cloudinary"],
    };

    this.commands = [
      "help",
      "about",
      "skills",
      "experience",
      "education",
      "projects",
      "skills-visual",
      "contact",
      "theme",
      "matrix",
      "stop-matrix",
      "calc",
      "pdf",
      "clear",
    ];

    this.setupEventListeners();
    this.applyTheme(this.currentTheme);
    this.printWelcomeMessage();
  }

  setupEventListeners() {
    if (this.input) {
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.handleCommand();
        } else if (e.key === "Tab") {
          e.preventDefault();
          this.autoComplete();
        }
      });
    }

    document.querySelectorAll(".close-button").forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        this.closeModal(modal);
      });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal.active").forEach((modal) => {
          this.closeModal(modal);
        });
      }
    });

    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => {
        this.showModal(this.themeModal);
      });
    }

    document.querySelectorAll(".theme-option").forEach((option) => {
      option.addEventListener("click", () => {
        const theme = option.dataset.theme;
        this.applyTheme(theme);
        this.closeModal(this.themeModal);
        this.printToOutput(`Theme changed to ${theme}.`, "success");
      });
    });
  }

  handleCommand() {
    const commandLine = this.input.value.trim();
    if (!commandLine) return;

    this.printCommand(commandLine);

    const [command, ...args] = commandLine.split(" ");
    const normalized = command.toLowerCase();

    switch (normalized) {
      case "help":
        this.showHelp();
        break;
      case "about":
        this.showAbout();
        break;
      case "skills":
        this.showSkills();
        break;
      case "experience":
        this.showExperience();
        break;
      case "education":
        this.showEducation();
        break;
      case "projects":
        this.showProjects();
        break;
      case "skills-visual":
        this.showSkillsVisual();
        break;
      case "contact":
        this.showContact();
        break;
      case "theme":
        this.showModal(this.themeModal);
        break;
      case "matrix":
        this.startMatrixEffect();
        break;
      case "stop-matrix":
        this.stopMatrixEffect();
        break;
      case "calc":
        this.calculate(args.join(" "));
        break;
      case "pdf":
        this.generatePDF();
        break;
      case "clear":
        this.output.innerHTML = "";
        this.printWelcomeMessage();
        break;
      default:
        this.printToOutput(
          `Command not found: ${normalized}. Type 'help' to see available commands.`,
          "error"
        );
    }

    this.input.value = "";
  }

  autoComplete() {
    const value = this.input.value.trim().toLowerCase();
    if (!value) return;

    const matches = this.commands.filter((cmd) => cmd.startsWith(value));

    if (matches.length === 1) {
      this.input.value = matches[0];
    } else if (matches.length > 1) {
      this.printToOutput(`Possible commands: ${matches.join(", ")}`, "info");
    }
  }

  showModal(modal) {
    if (!modal) return;
    modal.classList.add("active");
  }

  closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("active");
  }

  applyTheme(theme) {
    document.body.classList.remove(
      "theme-default",
      "theme-dracula",
      "theme-nord",
      "theme-solarized"
    );
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
  }

  printCommand(command) {
    const line = document.createElement("div");
    line.className = "output-line command-line";
    line.innerHTML = `<span class="prompt">vikram@portfolio:~$</span> ${command}`;
    this.output.appendChild(line);
    this.scrollToBottom();
  }

  printToOutput(content, type = "default") {
    const line = document.createElement("div");
    line.className = `output-line ${type}`;
    line.innerHTML = content;
    this.output.appendChild(line);
    this.scrollToBottom();
  }

  scrollToBottom() {
    const terminalContent = document.querySelector(".terminal-content");
    if (terminalContent) {
      terminalContent.scrollTop = terminalContent.scrollHeight;
    }
  }

  printWelcomeMessage() {
    const asciiArt = `
██╗   ██╗██╗██╗  ██╗██████╗  █████╗ ███╗   ███╗
██║   ██║██║██║ ██╔╝██╔══██╗██╔══██╗████╗ ████║
██║   ██║██║█████╔╝ ██████╔╝███████║██╔████╔██║
╚██╗ ██╔╝██║██╔═██╗ ██╔══██╗██╔══██║██║╚██╔╝██║
 ╚████╔╝ ██║██║  ██╗██║  ██║██║  ██║██║ ╚═╝ ██║
  ╚═══╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
`;

    this.printToOutput(`<pre class="ascii-art">${asciiArt}</pre>`);
    this.printToOutput(
      "Welcome to Vikram Singh's interactive terminal portfolio.",
      "success"
    );
    this.printToOutput(
      "BCA 4th-semester student | Aspiring Full-Stack Developer | Kanpur, India",
      "info"
    );
    this.printToOutput("Type 'help' to explore available commands.", "default");
  }

  showHelp() {
    this.printToOutput(`
      <div class="section-block">
        <h3>Available Commands</h3>
        <ul class="terminal-list">
          <li><strong>help</strong> - Show all commands</li>
          <li><strong>about</strong> - View introduction</li>
          <li><strong>skills</strong> - View technical skills</li>
          <li><strong>experience</strong> - View learning journey</li>
          <li><strong>education</strong> - View education details</li>
          <li><strong>projects</strong> - Open projects modal</li>
          <li><strong>skills-visual</strong> - Open skills modal</li>
          <li><strong>contact</strong> - View contact details</li>
          <li><strong>theme</strong> - Open theme selector</li>
          <li><strong>matrix</strong> - Start matrix effect</li>
          <li><strong>stop-matrix</strong> - Stop matrix effect</li>
          <li><strong>calc [expression]</strong> - Calculate expression</li>
          <li><strong>pdf</strong> - Download resume PDF</li>
          <li><strong>clear</strong> - Clear terminal</li>
        </ul>
      </div>
    `);
  }

  showAbout() {
    this.printToOutput(`
      <div class="section-block">
        <h3>About Me</h3>
        <p>I’m <strong>Vikram Singh</strong>, a BCA 4th-semester student from Kanpur, Uttar Pradesh.</p>
        <p>I’m passionate about full-stack web development, creative UI design, and building useful real-world projects.</p>
        <p>I enjoy working with React, Next.js, Tailwind CSS, Node.js, MongoDB, Python, and modern developer tools.</p>
        <p>My goal is to grow as a professional developer by building impactful products and continuously learning new technologies.</p>
      </div>
    `);
  }

  showSkills() {
    let html = `<div class="section-block"><h3>Technical Skills</h3>`;
    Object.entries(this.skills).forEach(([category, items]) => {
      html += `<h4>${category}</h4><p>${items.join(", ")}</p>`;
    });
    html += `</div>`;
    this.printToOutput(html);
  }

  showExperience() {
    this.printToOutput(`
      <div class="section-block">
        <h3>Experience / Journey</h3>
        <p><strong>Current:</strong> BCA student focused on full-stack development, academic learning, and project building.</p>
        <p><strong>Project Work:</strong> Built portfolio websites, quiz platforms, gallery apps, games, chat apps, and e-commerce style projects.</p>
        <p><strong>Growth Focus:</strong> Exploring AI tools, 3D experiences, better UI systems, and deployment workflows.</p>
      </div>
    `);
  }

  showEducation() {
    this.printToOutput(`
      <div class="section-block">
        <h3>Education</h3>
        <p><strong>Bachelor of Computer Applications (BCA)</strong></p>
        <p>Currently studying in 4th Semester</p>
        <p>Kanpur, Uttar Pradesh, India</p>
      </div>
    `);
  }

  showProjects() {
    if (!this.projectsModal) {
      this.printToOutput("Projects modal not found.", "error");
      return;
    }

    const container = this.projectsModal.querySelector(".projects-container");
    if (container) {
      container.innerHTML = this.projects
        .map(
          (project) => `
            <div class="project-card">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <p><strong>Tech:</strong> ${project.technologies.join(", ")}</p>
              <a href="${project.link}" target="_blank" rel="noopener noreferrer">View GitHub</a>
            </div>
          `
        )
        .join("");
    }

    this.showModal(this.projectsModal);
  }

  showSkillsVisual() {
    if (!this.skillsModal) {
      this.printToOutput("Skills modal not found.", "error");
      return;
    }

    const container = this.skillsModal.querySelector(".skills-container");
    if (container) {
      container.innerHTML = Object.entries(this.skills)
        .map(
          ([category, items]) => `
            <div class="skills-group">
              <h3>${category}</h3>
              <div class="skills-chip-wrap">
                ${items
                  .map((skill) => `<span class="skill-chip">${skill}</span>`)
                  .join("")}
              </div>
            </div>
          `
        )
        .join("");
    }

    this.showModal(this.skillsModal);
  }

  showContact() {
    this.printToOutput(`
      <div class="section-block">
        <h3>Contact</h3>
        <p><strong>Name:</strong> Vikram Singh</p>
        <p><strong>Location:</strong> Kanpur, Uttar Pradesh, India</p>
        <p><strong>GitHub:</strong> <a href="https://github.com/Babamosie333" target="_blank" rel="noopener noreferrer">github.com/Babamosie333</a></p>
        <p><strong>Focus:</strong> Full-Stack Development, Creative UI, Projects, AI Tools</p>
      </div>
    `);
  }

  startMatrixEffect() {
    if (this.matrixInterval) {
      this.printToOutput("Matrix effect is already running.", "info");
      return;
    }

    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.matrixInterval = setInterval(() => {
      const line = Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      this.printToOutput(`<span style="color:#22c55e;">${line}</span>`);
    }, 140);

    this.printToOutput("Matrix effect started.", "success");
  }

  stopMatrixEffect() {
    if (!this.matrixInterval) {
      this.printToOutput("Matrix effect is not running.", "info");
      return;
    }

    clearInterval(this.matrixInterval);
    this.matrixInterval = null;
    this.printToOutput("Matrix effect stopped.", "success");
  }

  calculate(expression) {
    if (!expression) {
      this.printToOutput("Usage: calc 5 + 10", "error");
      return;
    }

    try {
      const result = Function(`"use strict"; return (${expression})`)();
      this.printToOutput(`Result: ${result}`, "success");
    } catch (error) {
      this.printToOutput("Invalid expression.", "error");
    }
  }

  generatePDF() {
    const filePath = "./resume.pdf";

    this.printToOutput(`
      <div class="section-block">
        <h3>Resume PDF</h3>
        <p>Click below to download my resume.</p>
        <a href="${filePath}" download="Vikram-Singh-Resume.pdf" class="terminal-link">Download Resume PDF</a>
      </div>
    `, "success");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TerminalResume();
});
