interface MapSliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

export function MapSlider({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
}: MapSliderProps) {
  return (
    <div className="map-slider">
      <label className="map-slider__label" htmlFor={id}>
        {label}: <span>{value}</span>
      </label>
      <input
        id={id}
        type="range"
        className="map-slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
