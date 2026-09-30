import { Link } from "react-router-dom";
import Background from "@/features/Background/Index";
import Widget from "@/features/SocialWidget";

function Sandbox() {
  return (
    <>
      <Background Font={true} text={"Sandbox"} showCommands={true} />
      <Link to="/" className="back-button">
        ← Back
      </Link>
      <Widget HeaderTitle="Paint Tool" position="top-right" draggable={true}>
        <div style={{ marginBottom: "12px", color: "#ffffff", fontSize: "13px", lineHeight: "1.5" }}>Check out the paint tool page!</div>
        <div className="widget-footer">
          <Link to="/paint" className="linktree-btn">
            Go to Paint
          </Link>
        </div>
      </Widget>
    </>
  );
}

export default Sandbox;
