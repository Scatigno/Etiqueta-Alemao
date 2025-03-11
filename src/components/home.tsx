import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Package, Printer, QrCode, Tag } from "lucide-react";
import DeliveryForm from "./DeliveryForm";
import ShippingLabel from "./ShippingLabel";
import QRCodeGenerator from "./QRCodeGenerator";

interface DeliveryData {
  orderNumber: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  busInfo: {
    busNumber: string;
    busName: string;
    driverName: string;
  };
  boxCount: string;
  orderColor: string;
  maxDeliveryTime: string;
}

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("cadastro");
  const [deliveryData, setDeliveryData] = useState<DeliveryData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(
    "https://nostalgic-kare5-smhcp.dev.tempolabs.ai/pedido/123",
  );

  // Handle form submission
  const handleFormSubmit = (data: DeliveryData) => {
    // Ensure the time value is preserved correctly
    console.log("Dados do formulário:", data);

    setDeliveryData(data);
    // Construir URL com todos os parâmetros
    const url = new URL(
      `https://nostalgic-kare5-smhcp.dev.tempolabs.ai/pedido/${data.orderNumber}`,
    );

    // Adicionar todos os parâmetros à URL
    url.searchParams.append("maxTime", data.maxDeliveryTime || "18:00");
    url.searchParams.append("street", data.address.street);
    url.searchParams.append("number", data.address.number);
    url.searchParams.append("complement", data.address.complement || "");
    url.searchParams.append("neighborhood", data.address.neighborhood);
    url.searchParams.append("city", data.address.city);
    url.searchParams.append("state", data.address.state);
    url.searchParams.append("zipCode", data.address.zipCode);
    url.searchParams.append("busNumber", data.busInfo.busNumber);
    url.searchParams.append("busName", data.busInfo.busName || "");
    url.searchParams.append("driverName", data.busInfo.driverName);
    url.searchParams.append("boxCount", data.boxCount);
    url.searchParams.append("orderColor", data.orderColor);

    setQrCodeUrl(url.toString());
    setActiveTab("etiqueta");
  };

  // Format address for label
  const formatAddress = (address: DeliveryData["address"]) => {
    const { street, number, complement, neighborhood, city, state, zipCode } =
      address;
    let formattedAddress = `${street}, ${number}`;
    if (complement) formattedAddress += ` - ${complement}`;
    formattedAddress += ` - ${neighborhood}, ${city} - ${state}, ${zipCode}`;
    return formattedAddress;
  };

  // Format bus info for label
  const formatBusInfo = (busInfo: DeliveryData["busInfo"]) => {
    let info = `Placa: ${busInfo.busNumber}`;
    if (busInfo.busName && busInfo.busName.trim() !== "") {
      info += ` | Ônibus: ${busInfo.busName}`;
    }
    info += ` | Motorista: ${busInfo.driverName}`;
    return info;
  };

  // Handle print action
  const handlePrint = () => {
    // Adiciona uma folha de estilo temporária para impressão
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: 15cm 10cm landscape;
          margin: 0;
        }
        
        body * {
          visibility: hidden;
        }
        .card-to-print, .card-to-print * {
          visibility: visible;
        }
        .card-to-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 15cm;
          height: 10cm;
          margin: 0;
          padding: 0;
          border: none;
          box-shadow: none;
          transform: scale(1);
          transform-origin: top left;
        }
        
        /* Preservar cores e estilos exatos */
        .card-to-print h3,
        .card-to-print h4,
        .card-to-print p,
        .card-to-print span {
          color: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
        }
        
        /* Garantir que a faixa colorida seja impressa */
        .card-to-print [class*="bg-"] {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    window.print();

    // Remove a folha de estilo após a impressão
    document.head.removeChild(style);
  };

  // Handle save as PDF action
  const handleSaveAsPdf = () => {
    // In a real implementation, this would use a library like jsPDF or react-to-print
    // For this scaffolding, we'll just use the browser's print to PDF functionality
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Sistema de Cadastro de Entregas
        </h1>
        <p className="text-slate-600 mt-2">
          Cadastre informações de entrega e gere etiquetas com QR code para
          rastreamento de pedidos
        </p>
        <Separator className="mt-4" />
      </header>

      <main className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="cadastro" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Cadastro
            </TabsTrigger>
            <TabsTrigger value="etiqueta" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Etiqueta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cadastro" className="w-full">
            <div className="flex flex-col items-center">
              <Card className="w-full max-w-4xl bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Cadastro de Entrega</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo para gerar uma etiqueta de
                    entrega com QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeliveryForm onSubmit={handleFormSubmit} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="etiqueta" className="w-full">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              {deliveryData ? (
                <>
                  <ShippingLabel
                    orderNumber={deliveryData.orderNumber}
                    address={formatAddress(deliveryData.address)}
                    busInfo={formatBusInfo(deliveryData.busInfo)}
                    boxCount={parseInt(deliveryData.boxCount)}
                    orderColor={deliveryData.orderColor}
                    maxDeliveryTime={deliveryData.maxDeliveryTime}
                    onPrint={handlePrint}
                    onSaveAsPdf={handleSaveAsPdf}
                  />

                  <Card className="w-full max-w-xs bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        QR Code
                      </CardTitle>
                      <CardDescription>
                        Escaneie para acessar os detalhes do pedido
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <QRCodeGenerator
                        value={qrCodeUrl}
                        size={200}
                        title={`Pedido #${deliveryData.orderNumber}`}
                      />
                      <p className="text-sm text-center mt-4 text-slate-600">
                        Este QR code direciona para uma página com todos os
                        detalhes do pedido
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="w-full text-center p-12 bg-white rounded-lg shadow-sm">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Tag className="h-12 w-12 text-slate-400" />
                    <h3 className="text-xl font-medium text-slate-700">
                      Nenhuma etiqueta gerada
                    </h3>
                    <p className="text-slate-500 max-w-md">
                      Preencha o formulário de cadastro para gerar uma etiqueta
                      de entrega com QR code
                    </p>
                    <button
                      onClick={() => setActiveTab("cadastro")}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Voltar para o cadastro
                    </button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>
          Sistema de Cadastro de Entregas com Geração de Etiquetas ©{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Home;
