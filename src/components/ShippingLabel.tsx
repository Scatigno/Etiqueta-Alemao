import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Printer, Download } from "lucide-react";
import QRCodeGenerator from "./QRCodeGenerator";

interface ShippingLabelProps {
  orderNumber: string;
  address: string;
  busInfo: string;
  boxCount: number;
  orderColor: string;
  maxDeliveryTime: string;
  onPrint?: () => void;
  onSaveAsPdf?: () => void;
}

const ShippingLabel: React.FC<ShippingLabelProps> = ({
  orderNumber,
  address,
  busInfo,
  boxCount,
  orderColor,
  maxDeliveryTime,
  onPrint,
  onSaveAsPdf,
}) => {
  // Mapear cores para classes do Tailwind
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
    };

    return colorMap[color?.toLowerCase()] || "bg-blue-500";
  };

  const colorClass = getColorClass(orderColor);

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-[567px] h-[378px] p-4 border-2 border-gray-300 relative overflow-hidden card-to-print">
        {/* Faixa colorida no topo */}
        <div className={`absolute top-0 left-0 w-full h-8 ${colorClass}`}></div>

        <CardContent className="pt-10 flex flex-col h-full">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold">Pedido #{orderNumber}</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${colorClass}`}></div>
                  <span className="font-semibold">{orderColor}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">
                    Endereço de Entrega:
                  </h4>
                  <p className="text-sm">{address}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">
                    Informações de Transporte:
                  </h4>
                  <p className="text-sm">{busInfo}</p>
                </div>

                <div className="flex gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">
                      Quantidade de Caixas:
                    </h4>
                    <p className="text-sm">{boxCount}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">
                      Horário Máximo:
                    </h4>
                    <p className="text-sm">{maxDeliveryTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <QRCodeGenerator
                value={`https://nostalgic-kare5-smhcp.dev.tempolabs.ai/pedido/${orderNumber}?maxTime=${encodeURIComponent(maxDeliveryTime || "18:00")}&orderColor=${encodeURIComponent(orderColor)}&boxCount=${encodeURIComponent(String(boxCount))}`}
                size={150}
                title=""
              />
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-xs text-gray-500 text-center">
              Etiqueta gerada em {new Date().toLocaleDateString("pt-BR")} às{" "}
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 no-print">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4" />
          Imprimir Etiqueta
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onSaveAsPdf}
        >
          <Download className="h-4 w-4" />
          Salvar como PDF
        </Button>
      </div>
    </div>
  );
};

export default ShippingLabel;
