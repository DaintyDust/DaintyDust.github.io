import Background from "@/features/Background/Index";
// import CommandsWidget from "@/features/CommandsPopup/Index";
import Popup from "@/components/Popup";
import Widget from "@/features/SocialWidget";
import locales from "@/shared/locales";

interface IndexProps {
  lang: keyof typeof locales;
}

function Index({ lang }: IndexProps) {
  const locale = (lang ? locales[lang] : undefined) || locales.en;

  return (
    <>
      <Background Font={true} text={locale.backgroundText} />
      {/* <CommandsWidget DefaultText={locale.backgroundText} HasText={true} /> */}
      {locale.widgets.map((widget, index) => (
        <Widget key={`${widget.title}-${index}`} HeaderTitle={widget.title} draggable={widget.draggable} position={widget.position}>
          {widget.content}
        </Widget>
      ))}
      <Popup headerTitle="Discord Username" text="DaintyDust" />
    </>
  );
}

export default Index;
