import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Upload, FileText, Shield } from "lucide-react";

const TrainingForm = () => {
  const [formData, setFormData] = useState({
    datatreinamento: "",
    anexotreinamento: null as File | null,
    descricaoatividade: "",
    prazovalidade: "",
    datavalidade: "",
    observacoes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, anexotreinamento: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Card className="shadow-form border-0">
          <CardHeader className="bg-gradient-corporate text-primary-foreground">
            <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
              <Shield className="h-6 w-6" />
              Formulário de Treinamento
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Data do Treinamento e Anexo na mesma linha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="datatreinamento" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data do Treinamento
                  </Label>
                  <Input
                    id="datatreinamento"
                    type="date"
                    value={formData.datatreinamento}
                    onChange={(e) => handleInputChange("datatreinamento", e.target.value)}
                    className="border-border"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="anexotreinamento" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Anexo do Treinamento
                  </Label>
                  <div className="relative">
                    <Input
                      id="anexotreinamento"
                      type="file"
                      onChange={handleFileChange}
                      className="border-border file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                  {formData.anexotreinamento && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Arquivo selecionado: {formData.anexotreinamento.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Descrição da Atividade */}
              <div className="space-y-2">
                <Label htmlFor="descricaoatividade" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Descrição da Atividade
                </Label>
                <Textarea
                  id="descricaoatividade"
                  placeholder="Descreva detalhadamente a atividade do treinamento..."
                  value={formData.descricaoatividade}
                  onChange={(e) => handleInputChange("descricaoatividade", e.target.value)}
                  className="min-h-[120px] border-border resize-none"
                  required
                />
              </div>

              {/* Seção SST destacada */}
              <div className="bg-gradient-section rounded-lg border border-border p-6 shadow-section">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Campos a serem preenchidos pelo SST
                </h3>
                
                {/* Prazo e Data de Validade na mesma linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="prazovalidade" className="text-sm font-medium text-foreground">
                      Prazo de Validade (meses)
                    </Label>
                    <Input
                      id="prazovalidade"
                      type="number"
                      placeholder="Ex: 12"
                      value={formData.prazovalidade}
                      onChange={(e) => handleInputChange("prazovalidade", e.target.value)}
                      className="border-border"
                      min="1"
                      max="60"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="datavalidade" className="text-sm font-medium text-foreground">
                      Data de Validade
                    </Label>
                    <Input
                      id="datavalidade"
                      type="date"
                      value={formData.datavalidade}
                      onChange={(e) => handleInputChange("datavalidade", e.target.value)}
                      className="border-border"
                    />
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-sm font-medium text-foreground">
                    Observações
                  </Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações adicionais sobre o treinamento..."
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    className="min-h-[100px] border-border resize-none"
                  />
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-corporate hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  Salvar Treinamento
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 border-border hover:bg-secondary"
                  size="lg"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingForm;