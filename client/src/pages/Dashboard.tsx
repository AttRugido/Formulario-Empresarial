import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, TrendingDown, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { FormSubmission } from "@shared/schema";

interface FunnelData {
  step: number;
  count: number;
}

const stepLabels: Record<number, string> = {
  1: "Cargo/Função",
  2: "Gargalo",
  3: "Faturamento",
  4: "Tamanho Equipe",
  5: "Segmento",
  6: "Urgência",
  7: "Sócio",
  8: "Redes Sociais",
  9: "Dados de Contato"
};

export default function Dashboard() {
  const { data: submissions = [], isLoading: loadingSubmissions } = useQuery<FormSubmission[]>({
    queryKey: ["/api/submissions"]
  });

  const { data: funnelData = [], isLoading: loadingFunnel } = useQuery<FunnelData[]>({
    queryKey: ["/api/analytics/funnel"]
  });

  const handleExportCSV = () => {
    window.open("/api/submissions/export", "_blank");
  };

  const maxFunnelCount = Math.max(...funnelData.map(f => f.count), 1);

  const getDropOffRate = (currentStep: number, nextStep: number) => {
    const current = funnelData.find(f => f.step === currentStep)?.count || 0;
    const next = funnelData.find(f => f.step === nextStep)?.count || 0;
    if (current === 0) return 0;
    return Math.round(((current - next) / current) * 100);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" data-testid="button-back-home">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold">Dashboard</h1>
          </div>
          <Button 
            onClick={handleExportCSV} 
            className="bg-[#0b9a1b] hover:bg-[#0a8a18] text-white"
            data-testid="button-export-csv"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#121212] border-[#222]">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-lg font-medium text-white">Total de Submissões</CardTitle>
              <Users className="w-5 h-5 text-[#0b9a1b]" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white" data-testid="text-total-submissions">
                {loadingSubmissions ? "..." : submissions.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#121212] border-[#222]">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-lg font-medium text-white">Taxa de Conclusão</CardTitle>
              <TrendingDown className="w-5 h-5 text-[#0b9a1b]" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white" data-testid="text-completion-rate">
                {loadingFunnel ? "..." : (() => {
                  const step1 = funnelData.find(f => f.step === 1)?.count || 0;
                  const step9 = funnelData.find(f => f.step === 9)?.count || 0;
                  if (step1 === 0) return "0%";
                  return `${Math.round((step9 / step1) * 100)}%`;
                })()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#121212] border-[#222] mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white">Funil de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingFunnel ? (
              <p className="text-gray-400">Carregando...</p>
            ) : funnelData.length === 0 ? (
              <p className="text-gray-400">Nenhum dado disponível ainda</p>
            ) : (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNum) => {
                  const stepData = funnelData.find(f => f.step === stepNum);
                  const count = stepData?.count || 0;
                  const percentage = (count / maxFunnelCount) * 100;
                  const dropOff = stepNum < 9 ? getDropOffRate(stepNum, stepNum + 1) : null;

                  return (
                    <div key={stepNum} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          Passo {stepNum}: {stepLabels[stepNum]}
                        </span>
                        <span className="text-white font-medium" data-testid={`text-funnel-step-${stepNum}`}>
                          {count} visitantes
                          {dropOff !== null && dropOff > 0 && (
                            <span className="text-red-400 ml-2">(-{dropOff}%)</span>
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-[#1a1a1a] rounded-full h-3">
                        <div
                          className="bg-[#0b9a1b] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-[#222]">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white">Submissões Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSubmissions ? (
              <p className="text-gray-400">Carregando...</p>
            ) : submissions.length === 0 ? (
              <p className="text-gray-400">Nenhuma submissão ainda</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#333]">
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Nome</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Email</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Telefone</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Cargo</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Faturamento</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="border-b border-[#222] hover:bg-[#1a1a1a]" data-testid={`row-submission-${sub.id}`}>
                        <td className="py-3 px-2 text-white">{sub.name || "-"}</td>
                        <td className="py-3 px-2 text-gray-300">{sub.email || "-"}</td>
                        <td className="py-3 px-2 text-gray-300">{sub.phone || "-"}</td>
                        <td className="py-3 px-2 text-gray-300">{sub.role || "-"}</td>
                        <td className="py-3 px-2 text-gray-300">{sub.revenue || "-"}</td>
                        <td className="py-3 px-2 text-gray-400">{formatDate(sub.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
