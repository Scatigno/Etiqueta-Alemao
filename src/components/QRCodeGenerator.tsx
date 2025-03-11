import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  title?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value = "https://nostalgic-kare5-smhcp.dev.tempolabs.ai/pedido/123",
  size = 150,
  bgColor = "#FFFFFF",
  fgColor = "#000000",
  level = "M",
  title = "QR Code do Pedido",
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-md shadow-sm">
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        title={title}
      />
      {title && (
        <p className="mt-2 text-sm text-gray-600 font-medium text-center">
          {title}
        </p>
      )}
    </div>
  );
};

export default QRCodeGenerator;
