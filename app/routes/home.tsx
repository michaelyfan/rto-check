import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

// TODO: what's this do?
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// TODO: how does the app "pick up" this component? Not used anywhere?
export default function Home() {
  return <Welcome />;
}
