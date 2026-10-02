import { useMediaQuery } from "@mantine/hooks";
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const projectWidget = locale.widgets.find((w) => w.title.toLowerCase().includes("project"));
  const socialWidget = locale.widgets.find((w) => w.title.toLowerCase().includes("social") || w.title.toLowerCase().includes("contact"));

  return (
    <>
      <Background Font={!isMobile} text={locale.backgroundText} />
      {/* <CommandsWidget DefaultText={locale.backgroundText} HasText={true} /> */}
      {isMobile ? (
        <div className="home-mobile-widgets">
          {projectWidget && (
            <Widget key="mobile-projects" HeaderTitle={projectWidget.title} draggable={false} className="home-fixed-widget">
              {projectWidget.content}
            </Widget>
          )}

          {socialWidget && (
            <Widget key="mobile-socials" HeaderTitle={socialWidget.title} draggable={false} className="home-fixed-widget">
              {socialWidget.content}
            </Widget>
          )}
        </div>
      ) : (
        locale.widgets.map((widget, index) => (
          <Widget key={`${widget.title}-${index}`} HeaderTitle={widget.title} draggable={widget.draggable} position={widget.position}>
            {widget.content}
          </Widget>
        ))
      )}
      <Popup headerTitle="Discord Username" text="DaintyDust" />
    </>
  );
}

export default Index;
