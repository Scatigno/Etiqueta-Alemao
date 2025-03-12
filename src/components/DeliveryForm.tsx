import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Truck, Package, MapPin, User, Hash, Clock } from "lucide-react";

// Define the form schema with Zod
const formSchema = z.object({
  orderNumber: z.string().min(1, { message: "Número do pedido é obrigatório" }),
  address: z.object({
    street: z.string().min(1, { message: "Rua é obrigatória" }),
    number: z.string().min(1, { message: "Número é obrigatório" }),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, { message: "Bairro é obrigatório" }),
    city: z.string().min(1, { message: "Cidade é obrigatória" }),
    state: z.string().min(1, { message: "Estado é obrigatório" }),
    zipCode: z
      .string()
      .min(8, { message: "CEP inválido" })
      .max(9, { message: "CEP inválido" }),
  }),
  busInfo: z.object({
    busNumber: z.string().min(1, { message: "Placa do ônibus é obrigatória" }),
    busName: z.string().optional(),
    driverName: z
      .string()
      .min(1, { message: "Nome do motorista é obrigatório" }),
  }),
  boxCount: z
    .string()
    .min(1, { message: "Quantidade de caixas é obrigatória" }),
  orderColor: z.string().min(1, { message: "Cor do pedido é obrigatória" }),
  maxDeliveryTime: z
    .string()
    .min(1, { message: "Horário máximo é obrigatório" }),
});

type FormValues = z.infer<typeof formSchema>;

interface DeliveryFormProps {
  onSubmit?: (data: FormValues) => void;
}

const DeliveryForm = ({ onSubmit = () => {} }: DeliveryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default form values
  const defaultValues: FormValues = {
    orderNumber: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
    busInfo: {
      busNumber: "",
      busName: "",
      driverName: "",
    },
    boxCount: "1",
    orderColor: "azul",
    maxDeliveryTime: "18:00",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorOptions = [
    { value: "vermelho", label: "Vermelho" },
    { value: "azul", label: "Azul" },
    { value: "verde", label: "Verde" },
    { value: "amarelo", label: "Amarelo" },
    { value: "roxo", label: "Roxo" },
  ];

  return (
    <Card className="w-full max-w-[600px] bg-white shadow-lg">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-2xl font-bold text-slate-800">
          Cadastro de Entrega
        </CardTitle>
        <CardDescription>
          Preencha os dados para gerar a etiqueta de entrega com QR Code
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Número do Pedido */}
            <FormField
              control={form.control}
              name="orderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4" /> Número do Pedido
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4" /> Endereço de Entrega
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Av. Brasil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address.complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Apto 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 01234-567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informações do Ônibus/Motorista */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-medium">
                <Truck className="h-4 w-4" /> Informações do Transporte
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="busInfo.busNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa do Ônibus</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: ABC-1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="busInfo.busName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Ônibus</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Viação Norte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="busInfo.driverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Motorista</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Quantidade de Caixas */}
            <FormField
              control={form.control}
              name="boxCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> Quantidade de Caixas
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Ex: 3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cor do Pedido */}
            <FormField
              control={form.control}
              name="orderColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500"></div>
                    Cor do Pedido
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      {colorOptions.map((color) => (
                        <FormItem
                          key={color.value}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={color.value}
                              id={`color-${color.value}`}
                              className={`border-2 border-${color.value}-500`}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={`color-${color.value}`}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={`h-4 w-4 rounded-full bg-${color.value}-500`}
                            ></div>
                            {color.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Horário Máximo para Entrega */}
            <FormField
              control={form.control}
              name="maxDeliveryTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Horário Máximo para Entrega
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="Ex: 18:00"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Horário limite para a entrega ser realizada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Gerando etiqueta..." : "Gerar Etiqueta"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DeliveryForm;
