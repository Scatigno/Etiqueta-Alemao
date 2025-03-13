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
      vermelho: "bg-red-500",
      azul: "bg-blue-500",
      verde: "bg-green-500",
      amarelo: "bg-yellow-500",
      roxo: "bg-purple-500",
      laranja: "bg-orange-500",
      preto: "bg-black",
    };

    return colorMap[color?.toLowerCase() || ""] || "bg-blue-500";
  };

  const colorClass = getColorClass(orderColor);

  // Safely create QR code URL with proper error handling
  const createQRCodeUrl = () => {
    try {
      const baseUrl = `https://nostalgic-kare5-smhcp.dev.tempolabs.ai/pedido/${orderNumber || "123"}`;
      const params = new URLSearchParams();

      // Add all parameters with safe fallbacks
      params.append("maxTime", maxDeliveryTime || "18:00");
      params.append("orderColor", orderColor || "azul");
      params.append("boxCount", String(boxCount || 1));

      // Extract address components from the formatted address string
      try {
        // Attempt to parse the address string into components
        const addressParts = address.split(",");
        if (addressParts.length >= 2) {
          // Extract street and number from first part
          const streetAndNumber = addressParts[0].trim().split(" ");
          const streetNumber = streetAndNumber.pop() || "";
          const street = streetAndNumber.join(" ");
          params.append("street", street);
          params.append("number", streetNumber);

          // Extract complement if it exists (after a dash in the second part)
          let complement = "";
          let neighborhoodPart = addressParts[1].trim();
          if (neighborhoodPart.includes(" - ")) {
            const parts = neighborhoodPart.split(" - ");
            complement = parts[0].trim();
            neighborhoodPart = parts[1].trim();
          }
          params.append("complement", complement);

          // Extract neighborhood
          params.append("neighborhood", neighborhoodPart);

          // Extract city and state
          if (addressParts.length >= 3) {
            const cityStatePart = addressParts[2].trim();
            const cityStateArr = cityStatePart.split(" - ");
            if (cityStateArr.length >= 2) {
              params.append("city", cityStateArr[0].trim());

              // Extract state and zipcode
              const stateZipArr = cityStateArr[1].trim().split(", ");
              if (stateZipArr.length >= 2) {
                params.append("state", stateZipArr[0].trim());
                params.append("zipCode", stateZipArr[1].trim());
              } else {
                // Se não conseguir extrair o CEP do formato esperado, tenta extrair diretamente
                const zipCodeMatch = address.match(/(\d{5}-\d{3}|\d{8})/);
                if (zipCodeMatch && zipCodeMatch[0]) {
                  params.append("zipCode", zipCodeMatch[0]);
                }
              }
            }
          }
        } else {
          // Fallback if parsing fails
          params.append("address", address || "");
        }
      } catch (error) {
        console.error("Error parsing address:", error);
        // Fallback to full address
        params.append("address", address || "");
      }

      // Safely extract bus info components
      if (busInfo) {
        // Extract bus number if available
        const busNumberMatch = busInfo.match(/Placa:\s*([^|]+)/);
        if (busNumberMatch && busNumberMatch[1]) {
          params.append("busNumber", busNumberMatch[1].trim());
        }

        // Extract bus name if available
        const busNameMatch = busInfo.match(/Ônibus:\s*([^|]+)/);
        if (busNameMatch && busNameMatch[1]) {
          params.append("busName", busNameMatch[1].trim());
        }

        // Extract driver name if available
        const driverNameMatch = busInfo.match(/Motorista:\s*(.+)$/);
        if (driverNameMatch && driverNameMatch[1]) {
          params.append("driverName", driverNameMatch[1].trim());
        }
      }

      return `${baseUrl}?${params.toString()}`;
    } catch (error) {
      console.error("Error creating QR code URL:", error);
      // Return a basic fallback URL if there's an error
      return `https://nostalgic-kare5-smhcp.dev.tempolabs.ai/pedido/${orderNumber || "123"}`;
    }
  };

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
                  <span className="font-semibold">
                    {orderColor?.charAt(0).toUpperCase() + orderColor?.slice(1)}
                  </span>
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
              <QRCodeGenerator value={createQRCodeUrl()} size={150} title="" />
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
