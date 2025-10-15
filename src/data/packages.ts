import { PackageItem } from "../types";

export const packages: PackageItem[] = [
  {
    id: "adaptive-media-picker",
    name: "adaptive_media_picker",
    description:
      "Adaptive image/video picker with camera & gallery access and permissions handling.",
    version: "^0.0.6",
    technologies: ["Flutter", "Dart", "Camera", "Gallery", "Permissions"],
    githubUrl: "https://github.com/jaimin-kavathia/adaptive_media_picker",
    pubDevUrl: "https://pub.dev/packages/adaptive_media_picker",
    blogUrl:
      "https://medium.com/@jaiminkavathia30/flutters-missing-piece-effortless-media-picking-with-limited-access-support-9a1a24404667",
  },
  {
    id: "smart-permission",
    name: "smart_permission",
    description:
      "Flutter runtime permissions made easy: one-line requests, adaptive dialogs, and full flows on Android & iOS.",
    version: "^0.0.3",
    technologies: [
      "Flutter",
      "Dart",
      "permission_handler",
      "Adaptive Dialogs",
      "Analytics",
    ],
    githubUrl: "https://github.com/jaimin-kavathia/smart_permission",
    pubDevUrl: "https://pub.dev/packages/smart_permission",
    blogUrl: "https://jaimin-kavathia.github.io/",
  },
];
