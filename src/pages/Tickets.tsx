import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPerformanceById } from "@/services/performanceService";
import { Calendar, Clock, Ticket } from "lucide-react";
import { TicketSection, getTicketSections } from "@/services/adminService";
import { useLanguage } from "@/context/LanguageContext";

// Секции с поддержкой мультиязычности
const SECTION_IDS = [
  { id: "parterre", name_en: "Parterre", name_ua: "Партер" },
  { id: "mezzanine", name_en: "Mezzanine", name_ua: "Бельєтаж" },
  { id: "firstTier", name_en: "1st Tier", name_ua: "1-й ярус" },
  { id: "secondTier", name_en: "2nd Tier", name_ua: "2-й ярус" },
  { id: "thirdTier", name_en: "3rd Tier", name_ua: "3-й ярус" },
];

interface SeatType {
  id: string;
  level: string;
  name: string;
  price: number;
  available: boolean;
  selected: boolean;
}

const Tickets = () => {
  const { language, t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const performance = id ? getPerformanceById(id) : undefined;
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedSeatLevel, setSelectedSeatLevel] = useState<string>(SECTION_IDS[0].id);
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [hasPrivilegeDocument, setHasPrivilegeDocument] = useState<boolean>(false);
  const [privilegeDocumentNumber, setPrivilegeDocumentNumber] = useState<string>("");
  const [isPrivilegeValid, setIsPrivilegeValid] = useState<boolean | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [ticketSections, setTicketSections] = useState<TicketSection[]>([]);
  const [ticketPricing, setTicketPricing] = useState<Record<string, number>>({});
  const [allSeats, setAllSeats] = useState<Record<string, SeatType[]>>({});

  // --- Новые состояния для полей оплаты ---
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Fetch ticket pricing and refresh on window focus
  useEffect(() => {
    const loadTicketSections = async () => {
      try {
        const sections = await getTicketSections();
        setTicketSections(sections);
        const priceMap: Record<string, number> = {};
        SECTION_IDS.forEach(level => {
          const dbSection = sections.find(s => s.section_id === level.id);
          priceMap[level.id] = dbSection && dbSection.price != null ? dbSection.price : (
            level.id.includes("parterre") ? 1000 :
            level.id.includes("mezzanine") ? 800 :
            level.id.includes("firstTier") ? 600 :
            level.id.includes("secondTier") ? 400 : 200
          );
        });
        setTicketPricing(priceMap);
      } catch (error) {
        console.error("Error loading ticket section prices:", error);
      }
    };

    loadTicketSections();

    // Refresh prices when window regains focus
    const handleFocus = () => loadTicketSections();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Generate seats whenever ticketPricing changes
  useEffect(() => {
    const newAllSeats: Record<string, SeatType[]> = {};
    SECTION_IDS.forEach(level => {
      newAllSeats[level.id] = generateSeatsForLevel(level.id);
    });
    setAllSeats(newAllSeats);

    // Update selected seats with new prices
    setSelectedSeats(prev =>
      prev.map(seat => {
        const levelPrice = ticketPricing[seat.level] || (
          seat.level.includes("parterre") ? 1000 :
          seat.level.includes("mezzanine") ? 800 :
          seat.level.includes("firstTier") ? 600 :
          seat.level.includes("secondTier") ? 400 : 200
        );
        return { ...seat, price: levelPrice };
      })
    );
  }, [ticketPricing]);

  // Generate fake seats for each level
  const generateSeatsForLevel = (level: string): SeatType[] => {
    const levelPrice = ticketPricing[level] || (
      level.includes("parterre") ? 1000 :
      level.includes("mezzanine") ? 800 :
      level.includes("firstTier") ? 600 :
      level.includes("secondTier") ? 400 : 200
    );
    const rows = level === "parterre" ? 10 : 5;
    const seatsPerRow = level === "parterre" ? 20 : 15;

    const seats: SeatType[] = [];
    for (let row = 1; row <= rows; row++) {
      const rowName = String.fromCharCode(64 + row); // Convert to A, B, C, etc.
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatId = `${level}_${rowName}${seatNum}`;
        const isAvailable = Math.random() > 0.3;

        seats.push({
          id: seatId,
          level,
          name: `${rowName}${seatNum}`,
          price: levelPrice,
          available: isAvailable,
          selected: false
        });
      }
    }

    return seats;
  };

  // Get seats for the currently selected level
  const seatsForCurrentLevel = allSeats[selectedSeatLevel] || [];

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!performance) {
    return <Navigate to="/not-found" />;
  }

  const handleSeatClick = (seat: SeatType) => {
    if (!seat.available) return;

    if (selectedSeats.some(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getTotalAmount = () => {
    let total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    if (hasPrivilegeDocument && isPrivilegeValid) {
      total = total * 0.8; // Apply 20% discount
    }
    return total;
  };

  const verifyPrivilegeDocument = () => {
    const isValid = privilegeDocumentNumber.length >= 6;
    setIsPrivilegeValid(isValid);

    toast({
      title: isValid ? "Privilege Document Verified" : "Invalid Privilege Document",
      description: isValid
        ? "20% discount will be applied to your order."
        : "The document number you provided is invalid.",
      variant: isValid ? "default" : "destructive",
    });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase tickets.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckoutOpen(true);
  };

  const handleCompletePurchase = () => {
    // Проверка всех полей оплаты
    if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
      toast({
        title: t("tickets.fillAllFields") || "Заполните все поля оплаты!",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Purchase Successful!",
      description: `You have successfully purchased ${selectedSeats.length} tickets. An email receipt has been sent to your email address.`,
    });

    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-theatre-burgundy text-white py-12">
          <div className="theatre-container">
            <h1 className="text-3xl font-bold">{performance.name} - {t("tickets.buy")}</h1>
            <div className="flex items-center mt-4">
              <div className="flex items-center mr-6">
                <Calendar size={18} className="mr-2 text-theatre-gold" />
                <span>{formatDate(performance.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-theatre-gold" />
                <span>{performance.startTime}</span>
              </div>
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="theatre-container">
            {!isCheckoutOpen ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("tickets.selectSeats")}</CardTitle>
                      <CardDescription>{t("tickets.selectSeatsSubtitle")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue={selectedSeatLevel} value={selectedSeatLevel} onValueChange={setSelectedSeatLevel} className="w-full">
                        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
                          {SECTION_IDS.map((level) => (
                            <TabsTrigger key={level.id} value={level.id} className="text-xs md:text-sm">
                              {language === "ua" ? level.name_ua : level.name_en}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {SECTION_IDS.map((level) => (
                          <TabsContent key={level.id} value={level.id} className="mt-0">
                            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                              <h3 className="text-lg font-semibold mb-2">{language === "ua" ? level.name_ua : level.name_en}</h3>
                              <p className="text-gray-600">Price: {ticketPricing[level.id] || 0} ₴</p>
                            </div>
                            <div className="text-center mb-8">
                              <div className="bg-theatre-burgundy text-white py-2 px-4 rounded-t-lg inline-block">
                                {t("tickets.stage")}
                              </div>
                              <div className="w-full h-2 bg-theatre-burgundy"></div>
                            </div>
                            <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1 md:gap-2">
                              {seatsForCurrentLevel.map((seat) => {
                                const isSelected = selectedSeats.some(s => s.id === seat.id);
                                let className = "aspect-square text-xs flex items-center justify-center cursor-pointer transition-colors rounded-sm";

                                if (!seat.available) {
                                  className += " bg-gray-300 text-gray-500 cursor-not-allowed";
                                } else if (isSelected) {
                                  className += " bg-theatre-gold text-black font-medium";
                                } else {
                                  className += " bg-gray-100 hover:bg-theater-gold/50 text-gray-800";
                                }

                                return (
                                  <div
                                    key={seat.id}
                                    className={className}
                                    onClick={() => handleSeatClick(seat)}
                                    title={`${language === "ua" ? (SECTION_IDS.find(s => s.id === seat.level)?.name_ua ?? seat.level) : (SECTION_IDS.find(s => s.id === seat.level)?.name_en ?? seat.level)} - Seat ${seat.name} - ${seat.price} ₴`}
                                  >
                                    {seat.name}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-gray-100 mr-2"></div>
                                <span className="text-sm">{t("tickets.available")}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-theatre-gold mr-2"></div>
                                <span className="text-sm">{t("tickets.selected")}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                                <span className="text-sm">{t("tickets.NotAvailable")}</span>
                              </div>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Ticket className="mr-2" />
                        {t("tickets.yourOrder")}
                      </CardTitle>
                      <CardDescription>{t("tickets.yourOrderSubtitle")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedSeats.length > 0 ? (
                        <div className="space-y-4">
                          {selectedSeats.map((seat) => {
                            const levelInfo = SECTION_IDS.find(l => l.id === seat.level);
                            return (
                              <div key={seat.id} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{levelInfo ? (language === "ua" ? levelInfo.name_ua : levelInfo.name_en) : seat.level} - {t("tickets.seat")} {seat.name}</p>
                                  <p className="text-sm text-gray-500">{performance.name}</p>
                                </div>
                                <p className="font-medium">{seat.price} ₴</p>
                              </div>
                            );
                          })}
                          <Separator />
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <Checkbox
                                id="privilege"
                                checked={hasPrivilegeDocument}
                                onCheckedChange={(checked) => {
                                  setHasPrivilegeDocument(!!checked);
                                  setIsPrivilegeValid(null);
                                  setPrivilegeDocumentNumber("");
                                }}
                              />
                              <label htmlFor="privilege" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t("tickets.privilegeDocument")}
                              </label>
                            </div>
                            {hasPrivilegeDocument && (
                              <div className="space-y-2">
                                <Label htmlFor="privilegeDocument">{t("tickets.privilegeDocumentNumber")}</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id="privilegeDocument"
                                    value={privilegeDocumentNumber}
                                    onChange={(e) => {
                                      setPrivilegeDocumentNumber(e.target.value);
                                      setIsPrivilegeValid(null);
                                    }}
                                    placeholder="Enter document number"
                                  />
                                  <Button
                                    onClick={verifyPrivilegeDocument}
                                    size="sm"
                                    variant="outline"
                                  >
                                    {t("tickets.verify")}
                                  </Button>
                                </div>
                                {isPrivilegeValid !== null && (
                                  <p className={`text-sm ${isPrivilegeValid ? "text-green-600" : "text-red-600"}`}>
                                    {isPrivilegeValid
                                      ? "Document verified! 20% discount applied."
                                      : "Invalid document number."}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>{t("tickets.total")}</span>
                            <span>{getTotalAmount()} ₴</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-gray-500">{t("tickets.noSeats")}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-theatre-burgundy hover:bg-theatre-burgundy/90 text-white"
                        disabled={selectedSeats.length === 0}
                      >
                        {t("tickets.proceedPayment")}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>{t("tickets.complete")}</CardTitle>
                  <CardDescription>{t("tickets.completeSubtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t("tickets.orderSum")}</h3>
                      <p className="text-gray-600">{performance.name} {t("tickets.on")} {formatDate(performance.date)} {t("tickets.at")} {performance.startTime}</p>
                      <p className="text-gray-600">{selectedSeats.length} {t("tickets.seats")} {selectedSeats.map(s => s.name).join(", ")}</p>
                      {hasPrivilegeDocument && isPrivilegeValid && (
                        <p className="text-green-600">{t("tickets.discountApply")}</p>
                      )}
                      <p className="font-bold mt-2">{t("tickets.total")} {getTotalAmount()} ₴</p>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t("tickets.paymentInf")}</h3>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">{t("tickets.cardholder")}</Label>
                        <Input id="cardName" placeholder={t("tickets.nameCard")} value={cardName} onChange={e => setCardName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">{t("tickets.cardnumber")}</Label>
                        <Input id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">{t("tickets.expirationDate")}</Label>
                          <Input id="expiry" placeholder={t("tickets.monthYear")} value={expiry} onChange={e => setExpiry(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">{t("tickets.securityDate")}</Label>
                          <Input id="cvv" placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    {t("tickets.backButton")}
                  </Button>
                  <Button
                    className="bg-theatre-burgundy hover:bg-theatre-burgundy/90 text-white"
                    onClick={handleCompletePurchase}
                    disabled={!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()}
                  >
                    {t("tickets.completePurchaseButton")}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tickets;
