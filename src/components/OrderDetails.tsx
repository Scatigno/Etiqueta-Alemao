import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, MapPin, Truck, Clock } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Obter o horário máximo da URL se disponível
  const searchParams = new URLSearchParams(window.location.search);
  const maxTimeFromUrl = searchParams.get("maxTime") || "18:00";
  console.log("Horário da URL:", maxTimeFromUrl);

  // Obter os parâmetros da URL para todos os dados do pedido
  const street = searchParams.get("street") || "";
  const number = searchParams.get("number") || "";
  const complement = searchParams.get("complement") || "";
  const neighborhood = searchParams.get("neighborhood") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const zipCode = searchParams.get("zipCode") || "";
  const busNumber = searchParams.get("busNumber") || "";
  const busName = searchParams.get("busName") || "";
  const driverName = searchParams.get("driverName") || "";
  const boxCount = searchParams.get("boxCount") || "1";
  const orderColor = searchParams.get("orderColor") || "Azul";

  // Em uma aplicação real, você buscaria os dados do pedido de uma API
  // Aqui estamos usando os dados da URL
  const orderData = {
    orderNumber: id || "12345",
    status: "Em trânsito",
    createdAt: new Date().toLocaleDateString("pt-BR"),
    estimatedDelivery: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("pt-BR"),

    address: {
      street: street || "Av. Brasil",
      number: number || "123",
      complement: complement || "Apto 101",
      neighborhood: neighborhood || "Centro",
      city: city || "São Paulo",
      state: state || "SP",
      zipCode: zipCode || "01234-567",
    },
    busInfo: {
      busNumber: busNumber || "ABC-1234",
      busName: busName || "Viação Norte",
      driverName: driverName || "João Silva",
    },
    boxCount: parseInt(boxCount) || 3,
    orderColor: orderColor || "Azul",
  };

  const formatAddress = (address: typeof orderData.address) => {
    const { street, number, complement, neighborhood, city, state, zipCode } =
      address;
    let formattedAddress = `${street}, ${number}`;
    if (complement) formattedAddress += ` - ${complement}`;
    formattedAddress += ` - ${neighborhood}, ${city} - ${state}, ${zipCode}`;
    return formattedAddress;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "entregue":
        return "bg-green-100 text-green-800";
      case "em trânsito":
        return "bg-blue-100 text-blue-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </div>

        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Detalhes do Pedido #{orderData.orderNumber}
              </h1>
              <p className="text-slate-600 mt-2">
                Acompanhe as informações do seu pedido
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}
              >
                {orderData.status}
              </span>
            </div>
          </div>
          <Separator className="mt-4" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Cor do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{orderData.orderColor}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Quantidade de Caixas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{orderData.boxCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Horário Máximo de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{maxTimeFromUrl}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-500" />
              <CardTitle>Endereço de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                {formatAddress(orderData.address)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Truck className="h-5 w-5 text-slate-500" />
              <CardTitle>Informações de Transporte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Placa {orderData.busInfo.busNumber}
              </p>
              {orderData.busInfo.busName && (
                <p className="text-slate-700">
                  Ônibus: {orderData.busInfo.busName}
                </p>
              )}
              <p className="text-slate-700">
                Motorista: {orderData.busInfo.driverName}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
