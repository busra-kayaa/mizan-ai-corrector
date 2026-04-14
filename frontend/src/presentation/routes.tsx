// src/presentation/routes.tsx
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { AnalyzerPage } from "./pages/AnalyzerPage";
import { DocsLayout } from "./pages/docs/DocsLayout";
import { AboutSection } from "./pages/docs/AboutSection";
import { AuthenticationSection } from "./pages/docs/AuthenticationSection";
import { ErrorsSection } from "./pages/docs/ErrorsSection";
import { MetadataSection } from "./pages/docs/MetadataSection";
import { VersioningSection } from "./pages/docs/VersioningSection";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: AnalyzerPage,
            },
            {
                path: "how-to-use",
                Component: DocsLayout,
                children: [
                    { index: true, Component: AboutSection },
                    { path: "authentication", Component: AuthenticationSection },
                    { path: "errors", Component: ErrorsSection },
                    { path: "metadata", Component: MetadataSection },
                    { path: "versioning", Component: VersioningSection },
                ],
            },
        ],
    },
]);