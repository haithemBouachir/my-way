import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { getCroppedSquareDataUrl } from "./imageCropUtils";
import "./SquareImageCropper.css";

type SquareImageCropperProps = {
  open: boolean;
  imageSrc: string | null;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
};

export function SquareImageCropper({ open, imageSrc, onCancel, onApply }: SquareImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCropPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!imageSrc || !cropPixels) {
      return;
    }

    setIsApplying(true);
    try {
      const cropped = await getCroppedSquareDataUrl(imageSrc, cropPixels);
      onApply(cropped);
    } finally {
      setIsApplying(false);
    }
  };

  if (!open || !imageSrc) {
    return null;
  }

  return (
    <div className="cropper-overlay" role="dialog" aria-modal="true" aria-label="Crop image">
      <div className="cropper-card">
        <h3>Crop avatar</h3>

        <div className="cropper-canvas-wrap">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={false}
            objectFit="horizontal-cover"
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <label className="cropper-zoom-field">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>

        <div className="cropper-actions">
          <button type="button" className="secondary" onClick={onCancel} disabled={isApplying}>
            Cancel
          </button>
          <button type="button" onClick={handleApply} disabled={isApplying}>
            {isApplying ? "Applying..." : "Apply crop"}
          </button>
        </div>
      </div>
    </div>
  );
}
