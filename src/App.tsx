import { AppHeader }       from "./components/layout/AppHeader";
import { NomogramLayout }  from "./components/layout/NomogramLayout";
import { useNomogram }     from "./hooks/useNomogram";

export default function App() {
  const {
    inputs,
    result,
    heatmapGrid,
    contourLines,
    setTumorLocation,
    setNlr,
    setPlr,
  } = useNomogram();

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans antialiased">
      <AppHeader />
      <NomogramLayout
        inputs={inputs}
        result={result}
        heatmapGrid={heatmapGrid}
        contourLines={contourLines}
        onTumorLocationChange={setTumorLocation}
        onNlrChange={setNlr}
        onPlrChange={setPlr}
      />
    </div>
  );
}
