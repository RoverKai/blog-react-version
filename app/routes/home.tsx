import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageTransition from "~/components/PageTransition";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const me = {
    name: "Kaijia Zhu",
    age: "20",
    profession: "Software Engineer - full stack",
    status: "Status.FALL_IN_LOVE",
    langurage: "Java, Javascript, Rust",
  };

  const meString: string = `fn main() {
    let mut me = People {
        name: String::from("Kaijia Zhu"),
        age: 20,
        profession: String::from("Software Engineer - full stack"),
        langurage: String::from("rust, java, javascript"),
        status: Status::FallInLove,
        blogs: "http://kaijia.xyz"
    };
}`;
  const qual = JSON.stringify({});

  const [print, setPrint] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let i = 0;
    let waitTime = 50;

    const timer = setInterval(() => {
      setPrint(meString.slice(0, i));
      i++;

      if (i > meString.length) {
        clearInterval(timer);
        setTimeout(() => {
          navigate("test");
        }, 1000);
      }
    }, waitTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <PageTransition>
      <div className="font-mono w-[68ch] whitespace-pre-wrap">{print}</div>
    </PageTransition>
  );
}
