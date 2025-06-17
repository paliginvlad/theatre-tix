
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { TransactionRecord, getTransactions } from "@/services/adminService";
import { FileText, Download } from "lucide-react";

const AdminReports = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, navigate, toast]);

  const generateReport = async () => {
    try {
      const data = await getTransactions(startDate, endDate);
      setTransactions(data);
      
      // Calculate total revenue
      const total = data.reduce((sum, transaction) => sum + transaction.price, 0);
      setTotalRevenue(total);
      
      setReportGenerated(true);
      
      toast({
        title: "Report Generated",
        description: `Found ${data.length} transactions`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // In a real app, this would generate a CSV/Excel file
    // For now, we'll just show a success toast
    toast({
      title: "Export Successful",
      description: "Report has been exported to Excel",
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="theatre-container">
          <h1 className="text-3xl font-bold text-theatre-burgundy mb-8">{t("admin.reports.title")}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("admin.reports.dateRange")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">{t("admin.reports.from")}</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">{t("admin.reports.to")}</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={generateReport}
                  className="mt-6 bg-theatre-burgundy hover:bg-theatre-burgundy/90"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t("admin.reports.generate")}
                </Button>
              </CardContent>
            </Card>
            
            {reportGenerated && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.reports.sum")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t("admin.reports.ticketsSold")}:</span>
                    <span className="text-xl font-bold">{transactions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t("admin.reports.total")}:</span>
                    <span className="text-xl font-bold text-theatre-burgundy">
                      {totalRevenue.toLocaleString()} {t("admin.tickets.currency")}
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={handleExport}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t("admin.reports.export")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {reportGenerated && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t("admin.reports.performance")}</TableHead>
                    <TableHead>{t("admin.reports.section")}</TableHead>
                    <TableHead>{t("admin.reports.date")}</TableHead>
                    <TableHead>{t("admin.reports.price")}</TableHead>
                    <TableHead>{t("admin.reports.customer")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>{transaction.performanceName}</TableCell>
                      <TableCell>{transaction.section}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.price} {t("admin.tickets.currency")}</TableCell>
                      <TableCell>{transaction.customerName || "Anonymous"}</TableCell>
                    </TableRow>
                  ))}
                  
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No transactions found for the selected date range
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminReports;
