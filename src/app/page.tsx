"use client";

import { useState } from "react";
import { Navbar, type Section } from "@/components/docs/Navbar";
import { HomePage } from "@/components/docs/HomePage";
import { DocsPage } from "@/components/docs/DocsPage";
import { PlaygroundPage } from "@/components/docs/PlaygroundPage";
import { TutorialPage } from "@/components/docs/TutorialPage";
import { InstallPage } from "@/components/docs/InstallPage";

export default function Home() {
  const [section, setSection] = useState<Section>("home");
  const [selectedComponent, setSelectedComponent] = useState(0);
  const [playgroundCode, setPlaygroundCode] = useState(
    '<lk-center full-height>\n  <h1>Hello World</h1>\n  <p>Centered perfectly</p>\n</lk-center>'
  );

  return (
    <div className="flex min-h-screen flex-col font-mono">
      <Navbar section={section} onNavigate={setSection} />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {section === "home" && (
          <HomePage
            onNavigate={setSection}
            onSelectComponent={setSelectedComponent}
          />
        )}
        {section === "install" && <InstallPage />}
        {section === "docs" && (
          <DocsPage
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            onNavigate={setSection}
            onSetPlaygroundCode={setPlaygroundCode}
          />
        )}
        {section === "playground" && (
          <PlaygroundPage
            code={playgroundCode}
            onCodeChange={setPlaygroundCode}
          />
        )}
        {section === "tutorial" && <TutorialPage />}
      </div>
    </div>
  );
}
