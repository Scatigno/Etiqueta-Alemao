import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Printer, Download, ArrowRight } from "lucide-react";
import QRCodeGenerator from "./QRCodeGenerator";
import "./print-styles.css";

interface ShippingLabelProps {
  orderNumber?: string;
  address?: string;
  busInfo?: string;
  boxCount?: number;
  orderColor?: string;
  maxDeliveryTime?: string;
  onPrint?: () => void;
  onSaveAsPdf?: () => void;
}

const ShippingLabel: React.FC<ShippingLabelProps> = ({
  orderNumber = "12345",
  address = "Rua Exemplo, 123 - Bairro, Cidade - UF, 12345-678",
  busInfo = "Ônibus 42 - Motorista: João Silva",
  boxCount = 3,
  orderColor = "blue",
  maxDeliveryTime = "18:00",
  onPrint = () => console.log("Imprimir etiqueta"),
  onSaveAsPdf = () => console.log("Salvar como PDF"),
}) => {
  // Map de cores em português para classes do Tailwind
  const colorMap: Record<string, string> = {
    azul: "bg-blue-500",
    vermelho: "bg-red-500",
    verde: "bg-green-500",
    amarelo: "bg-yellow-500",
    roxo: "bg-purple-500",
    laranja: "bg-orange-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  // Tradução de cores para português
  const colorTranslation: Record<string, string> = {
    blue: "Azul",
    red: "Vermelho",
    green: "Verde",
    yellow: "Amarelo",
    purple: "Roxo",
    orange: "Laranja",
  };

  const colorClass = colorMap[orderColor.toLowerCase()] || "bg-gray-500";

  return (
    <div className="flex flex-col items-center w-full bg-white p-4">
      <h2 className="text-2xl font-bold mb-4">Etiqueta de Entrega</h2>

      {/* Etiqueta de entrega (15x10 cm) */}
      <Card className="w-[567px] h-[378px] p-4 border-2 border-gray-300 relative overflow-hidden print:w-[15cm] print:h-[10cm] print:shadow-none print:border-0 card-to-print">
        {/* Faixa de cor do pedido */}
        <div
          className={`absolute top-0 left-0 w-full h-10 ${colorClass} flex items-center justify-center`}
        >
          <span className="text-white font-bold text-lg">
            {colorTranslation[orderColor] ||
              orderColor.charAt(0).toUpperCase() + orderColor.slice(1)}
          </span>
        </div>

        <div className="mt-12 flex">
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Pedido #{orderNumber}</h3>
              <p className="text-gray-700 font-semibold">
                {boxCount} {boxCount === 1 ? "caixa" : "caixas"}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Endereço de Entrega:</h4>
              <p className="text-gray-700">{address}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Informações de Transporte:</h4>
              <p className="text-gray-700">{busInfo}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Horário Máximo de Entrega:</h4>
              <p className="text-gray-700 font-bold">
                {maxDeliveryTime || "18:00"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center ml-4">
            <QRCodeGenerator
              value={`https://nostalgic-kare5-smhcp.dev.tempolabs.ai/pedido/${orderNumber}?maxTime=${encodeURIComponent(maxDeliveryTime || "18:00")}&street=${encodeURIComponent(address.split(",")[0].trim())}&number=${encodeURIComponent(address.split(",")[1]?.split("-")[0]?.trim() || "")}&complement=${encodeURIComponent(address.includes("-") ? address.split("-")[1]?.trim() || "" : "")}&neighborhood=${encodeURIComponent(address.includes("-") ? address.split("-")[2]?.split(",")[0]?.trim() || "" : "")}&city=${encodeURIComponent(address.includes(",") ? address.split(",")[2]?.split("-")[0]?.trim() || "" : "")}&state=${encodeURIComponent(address.includes("-") ? address.split("-")[3]?.split(",")[0]?.trim() || "" : "")}&zipCode=${encodeURIComponent(address.split(",").pop()?.trim() || "")}&busNumber=${encodeURIComponent(busInfo.includes("Placa:") ? busInfo.split("Placa:")[1]?.split("|")[0]?.trim() || "" : "")}&busName=${encodeURIComponent(busInfo.includes("Ônibus:") ? busInfo.split("Ônibus:")[1]?.split("|")[0]?.trim() || "" : "")}&driverName=${encodeURIComponent(busInfo.includes("Motorista:") ? busInfo.split("Motorista:")[1]?.trim() || "" : "")}&boxCount=${encodeURIComponent(String(boxCount))}&orderColor=${encodeURIComponent(orderColor)}`}
              size={150}
              title=""
            />
          </div>
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-gray-500">
          Gerado em: {new Date().toLocaleDateString("pt-BR")}
        </div>

        <div className="absolute bottom-16 right-[85px] text-xs text-gray-500">
          Escaneie para detalhes
        </div>
      </Card>

      {/* Botões de ação */}
      <div className="flex gap-4 mt-6 no-print">
        <Button onClick={onPrint} className="flex items-center gap-2">
          <Printer size={16} />
          Imprimir
        </Button>
        <Button
          onClick={onSaveAsPdf}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Salvar como PDF
        </Button>
        <Button variant="link" className="flex items-center gap-1">
          Ver detalhes
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ShippingLabel;
