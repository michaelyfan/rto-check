import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

// TODO: what's this do?
export function meta({}: Route.MetaArgs) {
  return [
    { title: "RTO Compliance Tracker" },
    { name: "description", content: "This is an RTO compliance tracker application which helps employees track their compliance with company policies." },
  ];
}

// TODO: how does the app "pick up" this component? Not used anywhere?
export default function Home() {
  return <Welcome />;
}
