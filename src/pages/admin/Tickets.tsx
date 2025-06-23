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
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  TicketSection,
  getTicketSections,
  updateTicketSectionPrice,
  addOrUpdateTicketSection
} from "@/services/adminService";
import { Ticket } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Секції з підтримкою мультиязичності
const SECTION_IDS = [
  { id: "parterre", name_en: "Parterre", name_ua: "Партер" },
  { id: "mezzanine", name_en: "Mezzanine", name_ua: "Бельєтаж" },
  { id: "firstTier", name_en: "1st Tier", name_ua: "1-й ярус" },
  { id: "secondTier", name_en: "2nd Tier", name_ua: "2-й ярус" },
  { id: "thirdTier", name_en: "3rd Tier", name_ua: "3-й ярус" },
];

const AdminTickets = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [ticketSections, setTicketSections] = useState<TicketSection[]>([]);
  const [editPrices, setEditPrices] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("tickets");

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    loadData();
  }, [isAdmin, navigate, toast]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const sections = await getTicketSections();
      setTicketSections(sections);
      // Ініціалізація цін: якщо немає ціни, поле пусте
      const newEditPrices: Record<string, string> = {};
      SECTION_IDS.forEach(section => {
        const dbSection = sections.find(s => s.section_id === section.id);
        newEditPrices[section.id] = dbSection && dbSection.price != null ? String(dbSection.price) : "";
      });
      setEditPrices(newEditPrices);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ticket section data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (sectionId: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setEditPrices(prev => ({ ...prev, [sectionId]: value }));
    }
  };

  const handleUpdatePrice = async (sectionId: string) => {
    try {
      setUpdatingIds(prev => [...prev, sectionId]);
      const sectionMeta = SECTION_IDS.find(s => s.id === sectionId);
      const dbSection = ticketSections.find(s => s.section_id === sectionId);
      const price = editPrices[sectionId] === "" ? null : Number(editPrices[sectionId]);
      if (!dbSection) {
        // Додати нову секцію
        await addOrUpdateTicketSection({
          section_id: sectionId,
          name_en: sectionMeta?.name_en || sectionId,
          name_ua: sectionMeta?.name_ua || sectionId,
          price
        });
      } else {
        // Оновити тільки ціну
        await updateTicketSectionPrice(sectionId, price);
      }
      await loadData();
      toast({
        title: "Success",
        description: "Ticket section price updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket section price",
        variant: "destructive",
      });
    } finally {
      setUpdatingIds(prev => prev.filter(id => id !== sectionId));
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="theatre-container">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.tickets.section")}</TableHead>
                  <TableHead>{t("admin.tickets.price")} ({t("admin.tickets.currency")})</TableHead>
                  <TableHead className="w-[150px]">{t("admin.tickets.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SECTION_IDS.map((section) => {
                  const isUpdating = updatingIds.includes(section.id);
                  const dbSection = ticketSections.find(s => s.section_id === section.id);
                  const sectionName = t("lang") === "ua" ? section.name_ua : section.name_en;
                  return (
                    <TableRow key={section.id}>
                      <TableCell className="font-medium">{sectionName}</TableCell>
                      <TableCell>
                        {isLoading ? (
                          <div className="animate-pulse h-10 bg-gray-200 rounded w-24"></div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0"
                              value={editPrices[section.id]}
                              onChange={(e) => handlePriceChange(section.id, e.target.value)}
                              className="w-24"
                              disabled={isUpdating}
                              placeholder={""}
                            />
                            <span>{t("admin.tickets.currency")}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleUpdatePrice(section.id)}
                          className="bg-theatre-burgundy hover:bg-theatre-burgundy/90"
                          size="sm"
                          disabled={isLoading || isUpdating}
                        >
                          <Ticket className="h-4 w-4 mr-2" />
                          {isUpdating ? (
                            <span className="animate-pulse">Updating...</span>
                          ) : (
                            t("admin.tickets.setPrice")
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTickets;
