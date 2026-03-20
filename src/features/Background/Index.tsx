import { useEffect } from "react";
import CommandsWidget from "@/features/CommandsPopup/Index";

type BackgroundProps = {
  Font?: boolean;
  text?: string;
};

function Background({ Font = false, text }: BackgroundProps) {
  useEffect(() => {
    if (Font) {
      void import("./ts/font.ts").then((module) => {
        module.init(text);
      });
      return;
    }

    void import("./ts/index.ts").then((module) => {
      module.init();
    });
  }, [Font, text]);

  return <CommandsWidget DefaultText={text} HasText={Font} />;
}

export default Background;
