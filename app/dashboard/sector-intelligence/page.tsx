import SectorIntelligenceWorkflow from "./workflow";

// Thin server-component wrapper. Server identity (Clerk user) is read inside
// the server action when a run is saved, so we don't need to pass anything
// down here.
export default function SectorIntelligencePage() {
  return <SectorIntelligenceWorkflow />;
}
