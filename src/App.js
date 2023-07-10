import { useState } from "react";
import axios from "axios";
import CGLogo from "./chatGPT.png";

import "./App.css";
import JSZip from "jszip";

const App = () => {
  const [inputs, setInputs] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileSelection = (profile) => {
    setSelectedProfile(profile);
  };

  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };

  const handleDeleteInput = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  const handleInputChange = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };

  const handleLanguageClick = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(
        selectedLanguages.filter((lang) => lang !== language)
      );
      setSelectedFrameworks([]);
      setSelectedVersions([]);
      setSelectedLibraries([]);
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handleFrameworkClick = (framework) => {
    if (selectedFrameworks.includes(framework)) {
      setSelectedFrameworks(
        selectedFrameworks.filter((fw) => fw !== framework)
      );
      setSelectedVersions([]);
      setSelectedLibraries([]);
    } else {
      setSelectedFrameworks([...selectedFrameworks, framework]);
    }
  };

  const handleVersionClick = (version) => {
    if (selectedVersions.includes(version)) {
      setSelectedVersions(selectedVersions.filter((ver) => ver !== version));
    } else {
      setSelectedVersions([...selectedVersions, version]);
    }
  };

  const handleLibraryClick = (library) => {
    if (selectedLibraries.includes(library)) {
      setSelectedLibraries(selectedLibraries.filter((lib) => lib !== library));
    } else {
      setSelectedLibraries([...selectedLibraries, library]);
    }
  };

  const generateAndDownloadFiles = async () => {
    setLoading(true);

    try {
      const folderName = "GeneratedFolder";
      const files = [];

      // Collect inputs and selected buttons in prompt
      const promptValue = `Act as a highly experienced and seasoned ${selectedProfile} in the field. Build a ${
        inputs[0]
      }. Your goal is to generate code handling the following tasks: ${inputs
        .slice(1)
        .join(", ")} in ${selectedLanguages.join(
        ", "
      )} using ${selectedFrameworks.join(", ")} with ${selectedVersions.join(
        ", "
      )} and ${selectedLibraries.join(
        ", "
      )}.give every code a name file with the extension between {}, Then, act as a bug detector and review your code for security vulnerabilities and locate any logic errors or resource leaks, and add the fixes needed.Then, act as a code reviewer and analyze the whole previously provided code for code smells and assess the test coverage. Add improvements to your code. Then, act as a bug detector and review my code for security vulnerabilities and locate any logic errors, and add the fixes needed. Responses should not be translations of my input but code written in the language I specified. Do not write explanations on your reply. Keep in mind that it is important to be concise, specific, and straight to the point.`;

      // Communicate with the API and get code response
      const response = await axios.post("http://localhost:5555/chat", {
        prompt: promptValue,
      });

      // Add code response to the files array
      files.push({ name: "file1.js", code: response.data });

      const zip = new JSZip();
      const folder = zip.folder(folderName);

      const createFile = (folder, fileName, code) => {
        folder.file(fileName, code);
      };

      files.forEach((file) => {
        const fileName = `${file.name}`;
        createFile(folder, fileName, file.code);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipDownloadLink = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = zipDownloadLink;
      link.download = `${folderName}.zip`;
      link.click();

      setResponse("Project files received. Click the link to download.");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleGenerateAndDownload = () => {
    generateAndDownloadFiles();
  };

  const programmingLanguages = [
    {
      name: "JavaScript",
      frameworks: [
        {
          name: "React",
          versions: ["17.0.2", "16.13.1"],
          libraries: ["React-DOM", "Redux"],
        },
        {
          name: "Angular",
          versions: ["12.0.0", "11.2.14"],
          libraries: ["RxJS", "NgRx"],
        },
      ],
    },
    {
      name: "Python",
      frameworks: [
        {
          name: "Django",
          versions: ["3.2.4", "2.2.24"],
          libraries: ["Django REST Framework", "Celery"],
        },
        {
          name: "Flask",
          versions: ["2.0.1", "1.1.4"],
          libraries: ["Flask-RESTful", "SQLAlchemy"],
        },
      ],
    },
    {
      name: "Java",
      frameworks: [
        {
          name: "Spring Boot",
          versions: ["2.5.0", "2.4.6"],
          libraries: ["Spring Data JPA", "Spring Security"],
        },
        {
          name: "Hibernate",
          versions: ["5.5.3", "5.4.31"],
          libraries: ["Java Persistence API (JPA)", "C3P0"],
        },
      ],
    },
    {
      name: "C++",
      frameworks: [
        {
          name: "Qt",
          versions: ["6.1.2", "5.15.4"],
          libraries: ["Boost", "STL"],
        },
        {
          name: "Boost",
          versions: ["1.76.0", "1.72.0"],
          libraries: ["Boost Asio", "Boost Filesystem"],
        },
      ],
    },
    {
      name: "C#",
      frameworks: [
        {
          name: "ASP.NET Core",
          versions: ["5.0.7", "3.1.15"],
          libraries: ["Entity Framework Core", "SignalR"],
        },
        {
          name: "Unity",
          versions: ["2021.1.0", "2020.3.14"],
          libraries: ["UnityEngine", "UnityUI"],
        },
      ],
    },
    {
      name: "Ruby",
      frameworks: [
        {
          name: "Ruby on Rails",
          versions: ["6.1.3", "5.2.6"],
          libraries: ["Devise", "RSpec"],
        },
        {
          name: "Sinatra",
          versions: ["2.1.0", "2.0.8"],
          libraries: ["Sequel", "Slim"],
        },
      ],
    },
    {
      name: "Go",
      frameworks: [
        {
          name: "Gin",
          versions: ["1.7.2", "1.6.3"],
          libraries: ["GORM", "JWT"],
        },
        {
          name: "Echo",
          versions: ["4.6.1", "4.3.3"],
          libraries: ["Viper", "Cobra"],
        },
      ],
    },
    {
      name: "Swift",
      frameworks: [
        {
          name: "SwiftUI",
          versions: ["3.0", "2.0"],
          libraries: ["Combine", "CoreData"],
        },
        {
          name: "RxSwift",
          versions: ["6.0.0", "5.1.2"],
          libraries: ["RxCocoa", "RxAlamofire"],
        },
      ],
    },
    {
      name: "Kotlin",
      frameworks: [
        {
          name: "Spring Boot",
          versions: ["2.5.0", "2.4.5"],
          libraries: ["Ktor", "Exposed"],
        },
        {
          name: "Android",
          versions: ["11", "10"],
          libraries: ["Android Jetpack", "Retrofit"],
        },
      ],
    },
    {
      name: "Rust",
      frameworks: [
        {
          name: "Rocket",
          versions: ["0.5.0", "0.4.11"],
          libraries: ["Serde", "Diesel"],
        },
        {
          name: "Actix",
          versions: ["3.2.0", "3.0.0"],
          libraries: ["Actix-web", "Tokio"],
        },
      ],
    },
    {
      name: "TypeScript",
      frameworks: [
        {
          name: "Express",
          versions: ["4.17.1", "4.16.1"],
          libraries: ["TypeORM", "Socket.IO"],
        },
        {
          name: "NestJS",
          versions: ["8.0.0", "7.6.15"],
          libraries: ["Mongoose", "Passport"],
        },
      ],
    },
    {
      name: "PHP",
      frameworks: [
        {
          name: "Laravel",
          versions: ["8.x", "7.x"],
          libraries: ["Eloquent", "PHPUnit"],
        },
        {
          name: "Symfony",
          versions: ["5.3.0", "4.4.30"],
          libraries: ["Doctrine", "Twig"],
        },
      ],
    },
    {
      name: "HTML/CSS",
      frameworks: [
        {
          name: "Bootstrap",
          versions: ["5.0.1", "4.6.0"],
          libraries: ["jQuery", "Popper.js"],
        },
        {
          name: "Tailwind CSS",
          versions: ["2.2.4", "2.1.4"],
          libraries: ["Alpine.js", "PostCSS"],
        },
      ],
    },
    {
      name: "SQL",
      frameworks: [
        {
          name: "MySQL",
          versions: ["8.0", "5.7"],
          libraries: ["Connector/Python", "Connector/J"],
        },
        {
          name: "PostgreSQL",
          versions: ["13", "12"],
          libraries: ["psycopg2", "pgAdmin"],
        },
      ],
    },
    {
      name: "R",
      frameworks: [
        {
          name: "Shiny",
          versions: ["1.6.0", "1.5.0"],
          libraries: ["dplyr", "ggplot2"],
        },
        {
          name: "Plumber",
          versions: ["1.0.0", "0.4.6"],
          libraries: ["jsonlite", "httr"],
        },
      ],
    },
    {
      name: "MATLAB",
      frameworks: [
        {
          name: "Simulink",
          versions: ["2021a", "2020b"],
          libraries: ["DSP System Toolbox", "Control System Toolbox"],
        },
        {
          name: "Image Processing Toolbox",
          versions: ["12.4", "11.1"],
          libraries: ["Computer Vision Toolbox", "Image Acquisition Toolbox"],
        },
      ],
    },
    {
      name: "Perl",
      frameworks: [
        {
          name: "Mojolicious",
          versions: ["9.24", "8.66"],
          libraries: ["DBI", "Template Toolkit"],
        },
        {
          name: "Dancer2",
          versions: ["0.301003", "0.300004"],
          libraries: ["DBIx::Class", "Plack"],
        },
      ],
    },
    {
      name: "Shell scripting (Bash)",
      frameworks: [
        {
          name: "GNU Bash",
          versions: ["5.1", "4.4"],
          libraries: ["No specific libraries"],
        },
        {
          name: "Zsh",
          versions: ["5.8", "5.5.1"],
          libraries: ["No specific libraries"],
        },
      ],
    },
    {
      name: "Scala",
      frameworks: [
        {
          name: "Play Framework",
          versions: ["2.8.8", "2.7.9"],
          libraries: ["Slick", "Akka"],
        },
        {
          name: "Apache Spark",
          versions: ["3.1.2", "3.0.3"],
          libraries: ["Hadoop", "Delta Lake"],
        },
      ],
    },
    {
      name: "Lua",
      frameworks: [
        {
          name: "LÖVE",
          versions: ["11.3", "11.2"],
          libraries: ["No specific libraries"],
        },
        {
          name: "Torch",
          versions: ["1.9.0", "1.8.1"],
          libraries: ["No specific libraries"],
        },
      ],
    },
    {
      name: "Groovy",
      frameworks: [
        {
          name: "Grails",
          versions: ["5.0.1", "4.1.0"],
          libraries: ["Hibernate", "Spock"],
        },
        {
          name: "Gradle",
          versions: ["7.0.2", "6.8.3"],
          libraries: ["No specific libraries"],
        },
      ],
    },
    {
      name: "Objective-C",
      frameworks: [
        {
          name: "Cocoa Touch",
          versions: ["14.5", "14.4"],
          libraries: ["UIKit", "CoreData"],
        },
        {
          name: "Cocoa",
          versions: ["6.12", "6.11"],
          libraries: ["Foundation", "AppKit"],
        },
      ],
    },
    {
      name: "Dart",
      frameworks: [
        {
          name: "Flutter",
          versions: ["2.5.0", "2.2.3"],
          libraries: ["Provider", "Dio"],
        },
        {
          name: "AngularDart",
          versions: ["5.2.0", "5.0.0"],
          libraries: ["Dart SDK", "Angular"],
        },
      ],
    },
    {
      name: "Julia",
      frameworks: [
        {
          name: "JuliaDB",
          versions: ["0.20.0", "0.18.0"],
          libraries: ["No specific libraries"],
        },
        {
          name: "Flux",
          versions: ["0.12.6", "0.11.0"],
          libraries: ["No specific libraries"],
        },
      ],
    },
    {
      name: "Haskell",
      frameworks: [
        {
          name: "Yesod",
          versions: ["1.6.1", "1.4.5"],
          libraries: ["Persistent", "Esqueleto"],
        },
        {
          name: "Happstack",
          versions: ["7.5.2", "7.4.6"],
          libraries: ["No specific libraries"],
        },
      ],
    },
  ];

  return (
    <div className="wrapper">
      <img
        src={CGLogo}
        alt=""
        className={loading ? "cg-logo loading" : "cg-logo"}
      />
      <div>
        <select
          value={selectedProfile}
          onChange={(e) => handleProfileSelection(e.target.value)}
        >
          <option value="">Select a profile</option>
          <option value="Front-end Developer">Front-end Developer</option>
          <option value="Back-end Developer">Back-end Developer</option>
          <option value="Full-stack Developer">Full-stack Developer</option>
          <option value="Mobile App Developer">Mobile App Developer</option>
          <option value="Game Developer">Game Developer</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
          <option value="Quality Assurance (QA) Engineer">
            Quality Assurance (QA) Engineer
          </option>
          <option value="UI/UX Developer">UI/UX Developer</option>
          <option value="Data Engineer">Data Engineer</option>
          <option value="Machine Learning Engineer">
            Machine Learning Engineer
          </option>
        </select>

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={inputs[0] || ""}
            placeholder="Provide your Main Task"
            onChange={(e) => handleInputChange(0, e.target.value)}
            style={{}}
          />
        </div>

        {inputs.slice(1).map((input, index) => (
          <div
            key={index + 1}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              value={input}
              placeholder="Add a functionality"
              onChange={(e) => handleInputChange(index + 1, e.target.value)}
            />
            <button onClick={() => handleDeleteInput(index + 1)}>Delete</button>
          </div>
        ))}

        <button onClick={handleAddInput}>Add a functionality</button>
      </div>

      <div>
        {/* Display programming languages */}
        <h3>Programming Languages</h3>
        {programmingLanguages.map((language) => (
          <button
            key={language.name}
            onClick={() => handleLanguageClick(language.name)}
            style={{
              marginRight: "10px",
              marginBottom: "10px",
              backgroundColor: selectedLanguages.includes(language.name)
                ? "lightblue"
                : "#ccc",
              color: "#fff",
            }}
          >
            {language.name}
          </button>
        ))}
      </div>

      {selectedLanguages.map((selectedLanguage) => {
        const language = programmingLanguages.find(
          (lang) => lang.name === selectedLanguage
        );

        return (
          <div key={selectedLanguage}>
            <h3>Frameworks for {selectedLanguage}</h3>
            {language.frameworks.map((framework) => (
              <button
                key={framework.name}
                onClick={() => handleFrameworkClick(framework.name)}
                style={{
                  marginRight: "10px",
                  marginBottom: "10px",
                  backgroundColor: selectedFrameworks.includes(framework.name)
                    ? "lightblue"
                    : "#ccc",
                  color: "#fff",
                }}
              >
                {framework.name}
              </button>
            ))}
          </div>
        );
      })}

      {/* Display selected versions */}
      {selectedFrameworks.map((selectedFramework) => {
        const language = programmingLanguages.find((lang) =>
          lang.frameworks.some((fw) => fw.name === selectedFramework)
        );
        const framework = language.frameworks.find(
          (fw) => fw.name === selectedFramework
        );

        return (
          <div key={selectedFramework}>
            <h3>Versions for {selectedFramework}</h3>
            {framework.versions.map((version) => (
              <button
                key={version}
                onClick={() => handleVersionClick(version)}
                style={{
                  marginRight: "10px",
                  marginBottom: "10px",
                  backgroundColor: selectedVersions.includes(version)
                    ? "lightblue"
                    : "#ccc",
                  color: "#fff",
                }}
              >
                {version}
              </button>
            ))}
          </div>
        );
      })}

      {/* Display selected libraries */}
      {selectedFrameworks.map((selectedFramework) => {
        const language = programmingLanguages.find((lang) =>
          lang.frameworks.some((fw) => fw.name === selectedFramework)
        );
        const framework = language.frameworks.find(
          (fw) => fw.name === selectedFramework
        );

        return (
          <div key={selectedFramework}>
            <h3>Libraries for {selectedFramework}</h3>
            {framework.libraries.map((library) => (
              <button
                key={library}
                onClick={() => handleLibraryClick(library)}
                style={{
                  marginRight: "10px",
                  marginBottom: "10px",
                  backgroundColor: selectedLibraries.includes(library)
                    ? "lightblue"
                    : "#ccc",
                  color: "#fff",
                }}
              >
                {library}
              </button>
            ))}
          </div>
        );
      })}

      {/* Add button to generate and download files */}
      <button
        type="submit"
        onClick={handleGenerateAndDownload}
        disabled={loading}
      >
        Generate & Download Files
      </button>
      <p className="response-area">{loading ? "loading..." : response}</p>
    </div>
  );
};

export default App;
