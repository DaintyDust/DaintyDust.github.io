import type { ProjectItem } from "../types";
import NprfMainscreen from "@/assets/NPRF/Mainscreen.png";
import NprfMainscreen2 from "@/assets/NPRF/Mainscreen2.png";
import NprfControlsRoom from "@/assets/NPRF/ControlsRoom.png";
import NprfControlsRoom2 from "@/assets/NPRF/ControlsRoom2.png";
import NprfLasers from "@/assets/NPRF/Lasers.png";
import NprfMap from "@/assets/NPRF/Map.png";
import BetterSnapSettings from "@/assets/BetterSnap/Settings.png";
import CraftedHomepage from "@/assets/Crafted/Homepage.png";
import CraftedHomepage2 from "@/assets/Crafted/Homepage2.png";
import CraftedMenu from "@/assets/Crafted/Menu.png";
import CraftedProgram from "@/assets/Crafted/Program.png";
import CraftedCredits from "@/assets/Crafted/Credits.png";
import FluitendeFietserHomepage from "@/assets/Fluitende-Fietser/Homepage.png";
import FluitendeFietserBikes from "@/assets/Fluitende-Fietser/Bikes.png";
import FluitendeFietserBike from "@/assets/Fluitende-Fietser/Bike.png";
import FluitendeFietserRental from "@/assets/Fluitende-Fietser/Rental.png";
import FluitendeFietserHistory from "@/assets/Fluitende-Fietser/History.png";

export const projectsData: ProjectItem[] = [
  {
    id: "nanotech-nprf",
    title: "Nanotech Project (NPRF)",
    date: "2022 - 2025",
    description: `Together with a few friends, I created a Roblox game called Nanotech Project (NPRF),
      which has been played over 3,000 times. The game focuses on operating and maintaining a
      nuclear research facility. Players manage complex reactor systems, monitor critical
      parameters, respond to emergencies, and work together to prevent catastrophic failures.
      The game combines realistic systems management with exploration, roleplay, and dynamic
      disaster events.`,
    images: [NprfMainscreen2, NprfMainscreen, NprfControlsRoom, NprfLasers, NprfControlsRoom2, NprfMap],
    externalUrl: "https://www.roblox.com/games/11569994474/nanotech-project",
    externalUrlLabel: "Play on Roblox",
    languages: [
      {
        name: "Luau",
        badgeUrl: "https://img.shields.io/badge/Luau-00A2FF?style=flat&logo=roblox&logoColor=white",
      },
      {
        name: "Roblox Studio",
        badgeUrl: "https://img.shields.io/badge/Roblox_Studio-000000?style=flat&logo=roblox&logoColor=white",
      },
    ],
  },
  // {
  //   id: "studytools-themes",
  //   title: "StudyTools Themes",
  //   date: "2024",
  //   description: `StudyTools is a Chrome extension for Magister (a Dutch school platform), created by
  //     Quinten Althues. The extension has been downloaded over 150,000 times and allows users to
  //     customize Magister's appearance with different themes. I designed several custom css themes that
  //     are included in the extension, giving Magister a cleaner and more fun appearance.`,
  //   images: [
  //     NprfMainscreen2,
  //     {
  //       type: "compare",
  //       beforeImage: NprfControlsRoom,
  //       afterImage: NprfControlsRoom2,
  //       beforeLabel: "Control Room V1",
  //       afterLabel: "Control Room V2",
  //     },
  //     NprfMainscreen,
  //     NprfLasers,
  //     NprfMap,
  //   ],
  //   githubUrl: "https://github.com/QkeleQ10/Study-Tools",
  //   externalUrl: "https://chromewebstore.google.com/detail/study-tools-voor-magister/hacjodpccmeoocakiahjfndppdeallak",
  //   externalUrlLabel: "View on Chrome Web Store",
  //   languages: [
  //     {
  //       name: "Css",
  //       badgeUrl: "https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff",
  //     },
  //   ],
  // },
  {
    id: "better-snapchat",
    title: "Better Snapchat",
    date: "2025 - Now",
    description: `Better snapchat is a Chrome extension that i forked and improved.
    The original extension was taken down by Snapchat.
    I 
    
    `,
    image: BetterSnapSettings,
    githubUrl: "https://github.com/DaintyDust/better-snapchat",
    externalUrl: "https://discord.gg/Sq4DEhPcZh",
    externalUrlLabel: "Join the Discord",
    languages: [
      {
        name: "React 19",
        badgeUrl: "https://img.shields.io/badge/React_19-20232a?style=flat&logo=react&logoColor=61dafb",
      },
      {
        name: "TypeScript",
        badgeUrl: "https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white",
      },
      {
        name: "Mantine UI",
        badgeUrl: "https://img.shields.io/badge/Mantine_UI_9-339af0?style=flat&logo=mantine&logoColor=white",
      },
      {
        name: "Discord",
        badgeUrl: "https://dcbadge.limes.pink/api/server/https://discord.gg/Sq4DEhPcZh?style=flat",
      },
    ],
  },
  {
    id: "fluitende-fietser",
    title: "Fluitende Fietser",
    date: "2025",
    description: `Fluitende Fietser is a project I created for a school assignment.
    The goal was to create a website that provides information about the Fluitende Fietser event,
    which is a cycling event in the Netherlands. The website includes details about the event,
    registration information, and a gallery of past events.
    I used React and TypeScript to build the website, ensuring it was responsive and user-friendly.
    `,
    images: [FluitendeFietserHomepage, FluitendeFietserBikes, FluitendeFietserBike, FluitendeFietserRental, FluitendeFietserHistory],
    githubUrl: "https://github.com/DaintyDust/project-1-fluitende-fietser",
    externalUrl: "https://fluitende-fietser.daintydust.dev",
    externalUrlLabel: "View the Website",
    languages: [
      {
        name: "HTML",
        badgeUrl: "https://img.shields.io/badge/HTML-E34F26?style=flat&logo=html5&logoColor=white",
      },
      {
        name: "CSS",
        badgeUrl: "https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white",
      },
      {
        name: "JavaScript",
        badgeUrl: "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black",
      },
    ],
  },
  {
    id: "Crafted",
    title: "Crafted",
    date: "2026",
    description: `My school me and 3 other classmates to create a website for Crafted.
    Crafted is a event thats hosted by our school (and some others) to show people what we as school can do.
    So me and my classmates created a website for Crafted, where people can find information about the event, the program, social media and more.
    `,
    images: [CraftedHomepage, CraftedHomepage2, CraftedMenu, CraftedProgram, CraftedCredits],
    githubUrl: "https://github.com/larapalm0302/Crafted",
    externalUrl: "https://crafted.nu",
    externalUrlLabel: "Crafted.nu Website",
    languages: [
      {
        name: "PHP",
        badgeUrl: "https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white",
      },
      {
        name: "WordPress",
        badgeUrl: "https://img.shields.io/badge/WordPress-21759B?style=flat&logo=wordpress&logoColor=white",
      },
    ],
  },
];
