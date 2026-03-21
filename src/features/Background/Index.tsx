import { useEffect } from "react";
import CommandsWidget from "@/features/CommandsPopup/Index";

type BackgroundProps = {
  Font?: boolean;
  text?: string;
};

type BackgroundModule = {
  init: (text?: string) => void | Promise<void>;
  destroy?: () => void;
};

function Background({ Font = false, text }: BackgroundProps) {
  useEffect(() => {
    let disposed = false;
    let activeModule: BackgroundModule | undefined;

    const load = async () => {
      const module: BackgroundModule = Font ? await import("./ts/font.ts") : await import("./ts/index.ts");

      if (disposed) {
        module.destroy?.();
        return;
      }

      activeModule = module;
      await module.init(text);
    };

    void load();

    return () => {
      disposed = true;
      activeModule?.destroy?.();
    };
  }, [Font, text]);

  return <CommandsWidget DefaultText={text} HasText={Font} />;
}

export default Background;
