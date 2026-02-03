import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CalendarIcon, 
  Upload, 
  Star, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  Send,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Clock,
  MapPin
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const formSchema = z.object({
  // Dados Pessoais
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  
  // Dados Profissionais
  cargo: z.string().min(1, "Selecione um cargo"),
  departamento: z.string().min(1, "Selecione um departamento"),
  dataAdmissao: z.date({ required_error: "Data de admissão é obrigatória" }),
  salario: z.number().min(1000, "Salário mínimo é R$ 1.000"),
  
  // Preferências
  receberNotificacoes: z.boolean(),
  temaPreferido: z.enum(["claro", "escuro", "sistema"]),
  nivelAcesso: z.string(),
  
  // Avaliação
  avaliacaoServico: z.number().min(1).max(5),
  comentarios: z.string().optional(),
  
  // Termos
  aceitaTermos: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, name: "Dados Pessoais", icon: User },
  { id: 2, name: "Dados Profissionais", icon: Building },
  { id: 3, name: "Preferências", icon: FileText },
  { id: 4, name: "Avaliação", icon: Star },
];

export default function ExampleForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      cargo: "",
      departamento: "",
      salario: 3000,
      receberNotificacoes: true,
      temaPreferido: "sistema",
      nivelAcesso: "usuario",
      avaliacaoServico: 3,
      comentarios: "",
      aceitaTermos: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast({
      title: "Formulário enviado com sucesso!",
      description: "Seus dados foram salvos no sistema.",
    });
  };

  const progress = (currentStep / steps.length) * 100;

  const chips = ["React", "TypeScript", "Node.js", "Python", "SQL", "Docker", "AWS", "Git"];

  const toggleChip = (chip: string) => {
    setSelectedChips(prev => 
      prev.includes(chip) 
        ? prev.filter(c => c !== chip)
        : [...prev, chip]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "Arquivo carregado",
        description: `${file.name} foi carregado com sucesso.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-bold text-lg text-primary">Formulário de Exemplo</h1>
            <p className="text-xs text-muted-foreground">Demonstração de componentes EstrelaUI</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Badge variant="secondary">Preview Mode</Badge>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        {/* Progress Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Cadastro de Colaborador</CardTitle>
                <CardDescription>Preencha todos os campos para concluir o cadastro</CardDescription>
              </div>
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground">NC</AvatarFallback>
              </Avatar>
            </div>
            
            {/* Stepper */}
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    currentStep >= step.id 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted-foreground text-muted-foreground"
                  )}>
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={cn(
                    "ml-2 text-sm font-medium hidden sm:inline",
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-2",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
            
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-right">
              Etapa {currentStep} de {steps.length} ({Math.round(progress)}% concluído)
            </p>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={`step-${currentStep}`} className="w-full">
              {/* Step 1: Dados Pessoais */}
              <TabsContent value="step-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Dados Pessoais
                    </CardTitle>
                    <CardDescription>Informações básicas do colaborador</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Digite seu nome" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="email@exemplo.com" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="(00) 00000-0000" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input placeholder="000.000.000-00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label>Foto de Perfil</Label>
                      <div className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                        "hover:border-primary hover:bg-primary/5 cursor-pointer"
                      )}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          {uploadedFile ? (
                            <p className="text-sm text-primary font-medium">{uploadedFile.name}</p>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                Arraste uma imagem ou clique para fazer upload
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 2: Dados Profissionais */}
              <TabsContent value="step-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Dados Profissionais
                    </CardTitle>
                    <CardDescription>Informações sobre o cargo e departamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o cargo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="desenvolvedor">Desenvolvedor</SelectItem>
                                <SelectItem value="designer">Designer</SelectItem>
                                <SelectItem value="gerente">Gerente</SelectItem>
                                <SelectItem value="analista">Analista</SelectItem>
                                <SelectItem value="coordenador">Coordenador</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="departamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departamento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o departamento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                                <SelectItem value="rh">Recursos Humanos</SelectItem>
                                <SelectItem value="financeiro">Financeiro</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="operacoes">Operações</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dataAdmissao"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de Admissão</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                    ) : (
                                      <span>Selecione a data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="salario"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faixa Salarial: R$ {field.value?.toLocaleString('pt-BR')}</FormLabel>
                            <FormControl>
                              <Slider
                                min={1000}
                                max={30000}
                                step={500}
                                value={[field.value || 3000]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="py-4"
                              />
                            </FormControl>
                            <FormDescription>Arraste para ajustar o valor</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Chips de Habilidades */}
                    <div className="space-y-2">
                      <Label>Habilidades Técnicas</Label>
                      <div className="flex flex-wrap gap-2">
                        {chips.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => toggleChip(chip)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                              selectedChips.includes(chip)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                          >
                            {selectedChips.includes(chip) && <Check className="h-3 w-3 inline mr-1" />}
                            {chip}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedChips.length} habilidade(s) selecionada(s)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 3: Preferências */}
              <TabsContent value="step-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Preferências do Sistema
                    </CardTitle>
                    <CardDescription>Configure suas preferências de uso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="receberNotificacoes"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificações por Email</FormLabel>
                            <FormDescription>
                              Receber atualizações e notificações importantes por email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temaPreferido"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Tema Preferido</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="claro" />
                                </FormControl>
                                <FormLabel className="font-normal">Tema Claro</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="escuro" />
                                </FormControl>
                                <FormLabel className="font-normal">Tema Escuro</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="sistema" />
                                </FormControl>
                                <FormLabel className="font-normal">Seguir Sistema</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nivelAcesso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nível de Acesso</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o nível" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="usuario">Usuário Padrão</SelectItem>
                              <SelectItem value="moderador">Moderador</SelectItem>
                              <SelectItem value="administrador">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Define quais recursos você terá acesso no sistema
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertTitle>Horário de Trabalho</AlertTitle>
                      <AlertDescription>
                        Seu horário padrão de trabalho será das 08:00 às 17:00. 
                        Você pode alterar isso nas configurações após o cadastro.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 4: Avaliação */}
              <TabsContent value="step-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Avaliação e Finalização
                    </CardTitle>
                    <CardDescription>Sua opinião é importante para nós</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rating */}
                    <div className="space-y-2">
                      <Label>Como você avalia nosso processo de cadastro?</Label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Tooltip key={star}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => {
                                  setRating(star);
                                  form.setValue("avaliacaoServico", star);
                                }}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 transition-transform hover:scale-110"
                              >
                                <Star
                                  className={cn(
                                    "h-8 w-8 transition-colors",
                                    (hoverRating || rating) >= star
                                      ? "fill-warning text-warning"
                                      : "text-muted-foreground"
                                  )}
                                />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {star === 1 && "Muito Ruim"}
                              {star === 2 && "Ruim"}
                              {star === 3 && "Regular"}
                              {star === 4 && "Bom"}
                              {star === 5 && "Excelente"}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating > 0 && `${rating}/5`}
                        </span>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="comentarios"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comentários Adicionais</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Deixe seu feedback sobre o processo..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Opcional: compartilhe sugestões de melhoria
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aceitaTermos"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Aceito os Termos de Uso e Política de Privacidade
                            </FormLabel>
                            <FormDescription>
                              Você concorda com nossos termos de serviço e política de tratamento de dados.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Alert className="bg-success/10 border-success">
                      <Check className="h-4 w-4 text-success" />
                      <AlertTitle className="text-success">Quase lá!</AlertTitle>
                      <AlertDescription>
                        Revise seus dados e clique em "Enviar Cadastro" para finalizar.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" className="bg-success hover:bg-success/90">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Cadastro
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
