import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getTicketSections, getSoldTickets, updateSoldTickets, getLastProfit, updateLastProfit } from "@/services/adminService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const SECTION_IDS = [
  { id: "parterre", name_en: "Parterre", name_ua: "Партер" },
  { id: "mezzanine", name_en: "Mezzanine", name_ua: "Бельєтаж" },
  { id: "firstTier", name_en: "1st Tier", name_ua: "1-й ярус" },
  { id: "secondTier", name_en: "2nd Tier", name_ua: "2-й ярус" },
  { id: "thirdTier", name_en: "3rd Tier", name_ua: "3-й ярус" },
];

const COLORS = ["#B02A37", "#FFD700", "#A0AEC0", "#6B7280", "#F59E42"];

const Profit = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [ticketSections, setTicketSections] = useState<any[]>([]);
  const [editPrices, setEditPrices] = useState<Record<string, string>>({});
  const [sold, setSold] = useState<Record<string, string>>({});
  const [profits, setProfits] = useState<Record<string, number>>({});
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("table");

  useEffect(() => {
    if (!isAdmin) return;
    getTicketSections().then(sections => {
      setTicketSections(sections);
      const newEditPrices: Record<string, string> = {};
      SECTION_IDS.forEach(section => {
        const dbSection = sections.find(s => s.section_id === section.id);
        newEditPrices[section.id] = dbSection && dbSection.price != null ? String(dbSection.price) : "";
      });
      setEditPrices(newEditPrices);
    });
    // Загрузка проданных билетов из БД
    getSoldTickets().then(dbSold => {
      const soldStr: Record<string, string> = {};
      Object.entries(dbSold).forEach(([k, v]) => {
        soldStr[k] = v.toString();
      });
      setSold(soldStr);
    });
    // Загрузка последней рассчитанной прибыли
    getLastProfit().then(({ profits, total }) => {
      setProfits(profits);
      setTotalProfit(total);
    });
  }, [isAdmin]);

  const handleProfitCalc = async () => {
    let total = 0;
    const newProfits: Record<string, number> = {};
    SECTION_IDS.forEach(section => {
      const price = Number(editPrices[section.id]) || 0;
      const count = Number(sold[section.id]) || 0;
      const profit = price * count;
      newProfits[section.id] = profit;
      total += profit;
    });
    setProfits(newProfits);
    setTotalProfit(total);
    // Сохраняем значения sold в БД (преобразуем к number)
    const soldNum: Record<string, number> = {};
    Object.entries(sold).forEach(([k, v]) => {
      soldNum[k] = Number(v) || 0;
    });
    await updateSoldTickets(soldNum);
    // Сохраняем рассчитанную прибыль и общую сумму
    await updateLastProfit(newProfits, total);
  };

  // Данные для графиков
  const chartData = SECTION_IDS.map(section => ({
    name: t("lang") === "ua" ? section.name_ua : section.name_en,
    profit: profits[section.id] || 0
  }));

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="theatre-container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="table">{t("admin.profit.title")}</TabsTrigger>
              <TabsTrigger value="charts">{t("admin.profit.chartsTab")}</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <div className="bg-white rounded-lg shadow overflow-hidden p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">{t("admin.profit.title")}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.profit.section")}</TableHead>
                      <TableHead>{t("admin.profit.price")} ({t("admin.profit.currency")})</TableHead>
                      <TableHead>{t("admin.profit.sold")}</TableHead>
                      <TableHead>{t("admin.profit.profit")} ({t("admin.profit.currency")})</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SECTION_IDS.map(section => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">{t("lang") === "ua" ? section.name_ua : section.name_en}</TableCell>
                        <TableCell>{editPrices[section.id] || 0}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={sold[section.id] || ""}
                            onChange={e => setSold(prev => ({ ...prev, [section.id]: e.target.value }))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>{profits[section.id] || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-6">
                  <Button className="bg-theatre-burgundy hover:bg-theatre-burgundy/90" onClick={handleProfitCalc}>
                    {t("admin.profit.calculate")}
                  </Button>
                  <div className="text-xl font-bold">
                    {t("admin.profit.total")}: {totalProfit} {t("admin.profit.currency")}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="charts">
              <div className="bg-white rounded-lg shadow overflow-hidden p-10 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">{t("admin.profit.chartsTab")}</h2>
                {/* Секция 1: Количество проданных билетов */}
                <h3 className="text-xl font-bold mb-6">{t("admin.profit.soldSection")}</h3>
                <div className="flex flex-col md:flex-row gap-8 mb-16">
                  {/* Pie - sold */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4">{t("admin.profit.pieChart")}</h4>
                    <ResponsiveContainer width="100%" height={340}>
                      <PieChart>
                        <Pie
                          data={SECTION_IDS.map(section => ({
                            name: t("lang") === "ua" ? section.name_ua : section.name_en,
                            sold: Number(sold[section.id]) || 0
                          }))}
                          dataKey="sold"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          label={({ percent, x, y }) => (
                            <text x={x} y={y} fill="#222" fontSize={13} textAnchor="middle" dominantBaseline="central">
                              {`${(percent * 100).toFixed(1)}%`}
                            </text>
                          )}
                        >
                          {SECTION_IDS.map((section, idx) => (
                            <Cell key={`sold-pie-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value, name, props) => {
                          const total = SECTION_IDS.reduce((sum, s) => sum + (Number(sold[s.id]) || 0), 0);
                          return `${((props.payload.sold / total) * 100).toFixed(1)}%`;
                        }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Donut - sold */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4">{t("admin.profit.donutChart")}</h4>
                    <ResponsiveContainer width="100%" height={340}>
                      <PieChart>
                        <Pie
                          data={SECTION_IDS.map(section => ({
                            name: t("lang") === "ua" ? section.name_ua : section.name_en,
                            sold: Number(sold[section.id]) || 0
                          }))}
                          dataKey="sold"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={110}
                          label={({ percent, x, y }) => (
                            <text x={x} y={y} fill="#222" fontSize={13} textAnchor="middle" dominantBaseline="central">
                              {`${(percent * 100).toFixed(1)}%`}
                            </text>
                          )}
                        >
                          {SECTION_IDS.map((section, idx) => (
                            <Cell key={`sold-donut-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value, name, props) => {
                          const total = SECTION_IDS.reduce((sum, s) => sum + (Number(sold[s.id]) || 0), 0);
                          return `${((props.payload.sold / total) * 100).toFixed(1)}%`;
                        }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Bar - sold */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4">{t("admin.profit.soldBarChart")}</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={SECTION_IDS.map(section => ({
                        name: t("lang") === "ua" ? section.name_ua : section.name_en,
                        sold: Number(sold[section.id]) || 0
                      }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="sold">
                          {SECTION_IDS.map((section, idx) => (
                            <Cell key={`sold-bar-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Bar>
                        <RechartsTooltip formatter={(value) => `${value} ${t('admin.profit.sold')}`} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Секция 2: Прибыль */}
                <h3 className="text-xl font-bold mb-6">{t("admin.profit.profitSection")}</h3>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Pie - profit */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4">{t("admin.profit.pieChart")}</h4>
                    <ResponsiveContainer width="100%" height={340}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="profit"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          label={({ percent, x, y }) => (
                            <text x={x} y={y} fill="#222" fontSize={13} textAnchor="middle" dominantBaseline="central">
                              {`${(percent * 100).toFixed(1)}%`}
                            </text>
                          )}
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`profit-pie-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value, name, props) => `${((props.payload.profit / totalProfit) * 100).toFixed(1)}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Donut - profit */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4">{t("admin.profit.donutChart")}</h4>
                    <ResponsiveContainer width="100%" height={340}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="profit"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={110}
                          label={({ percent, x, y }) => (
                            <text x={x} y={y} fill="#222" fontSize={13} textAnchor="middle" dominantBaseline="central">
                              {`${(percent * 100).toFixed(1)}%`}
                            </text>
                          )}
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`profit-donut-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value, name, props) => `${((props.payload.profit / totalProfit) * 100).toFixed(1)}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Bar - profit */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4">{t("admin.profit.profitBarChart")}</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={chartData}>
                        <XAxis
                          dataKey="name"
                          tick={({ x, y, payload }) => {
                            const isMezzanine = payload.value === (t("lang") === "ua" ? "Бельєтаж" : "Mezzanine");
                            return (
                              <g transform={`translate(${x},${y + 10})`}>
                                <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
                                  {payload.value}
                                </text>
                                {isMezzanine && (
                                  <text x={0} y={20} dy={16} textAnchor="middle" fill="#B02A37" fontWeight="bold">
                                    {payload.value}
                                  </text>
                                )}
                              </g>
                            );
                          }}
                        />
                        <YAxis />
                        <Bar dataKey="profit">
                          {chartData.map((entry, idx) => (
                            <Cell key={`bar-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Bar>
                        <RechartsTooltip formatter={(value) => `${value} ${t('admin.profit.currency')}`} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profit;
