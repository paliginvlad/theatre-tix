import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Settings, Ticket, FileText, Calculator, Newspaper } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const AdminCard = ({ 
  title, 
  description, 
  icon, 
  linkTo 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  linkTo: string 
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          onClick={() => navigate(linkTo)} 
          className="w-full bg-theatre-burgundy hover:bg-theatre-burgundy/90"
        >
          Manage
        </Button>
      </CardFooter>
    </Card>
  );
};

const AdminChangePasswordCard: React.FC = () => {
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  // Тексты для двух языков
  const texts = {
    en: {
      cardTitle: "Change password",
      cardSubtitle: "Change admin password",
      dialogTitle: "Change Admin Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      save: "Save Password",
      saving: "Saving...",
      change: "Change Password",
      success: "Password Changed",
      successDesc: "Admin password updated successfully!",
      fail: "Password Change Failed",
      failDesc: "Failed to change password"
    },
    ua: {
      cardTitle: "Змінити пароль",
      cardSubtitle: "Змінити пароль адміністратора",
      dialogTitle: "Зміна пароля адміністратора",
      currentPassword: "Поточний пароль",
      newPassword: "Новий пароль",
      save: "Зберегти пароль",
      saving: "Збереження...",
      change: "Змінити пароль",
      success: "Пароль змінено",
      successDesc: "Пароль адміністратора успішно змінено!",
      fail: "Помилка зміни пароля",
      failDesc: "Не вдалося змінити пароль"
    }
  };
  const tr = texts[language] || texts.en;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        toast({
          title: tr.fail,
          description: data.error || tr.failDesc,
          variant: "destructive",
        });
        return;
      }
      setOldPassword("");
      setNewPassword("");
      toast({
        title: tr.success,
        description: tr.successDesc,
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: tr.fail,
        description: tr.failDesc,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-6 w-6 text-theatre-burgundy" />
          <span className="ml-2">{tr.cardTitle}</span>
        </CardTitle>
        <CardDescription>{tr.cardSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-theatre-burgundy text-white w-full">{tr.change}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tr.dialogTitle}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">{tr.currentPassword}</label>
                <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">{tr.newPassword}</label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-theatre-burgundy text-white" disabled={loading}>
                  {loading ? tr.saving : tr.save}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const Admin = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, navigate, toast]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="theatre-container">
          <h1 className="text-3xl font-bold text-theatre-burgundy mb-8">{t("admin.title")}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <AdminCard
              title={t("admin.performances")}
              description={t("admin.performances.subtitle")}
              icon={<Settings className="h-6 w-6 text-theatre-burgundy" />}
              linkTo="/admin/performances"
            /> */}
            <AdminCard
              title={t("admin.tickets")}
              description={t("admin.tickets.subtitle")}
              icon={<Ticket className="h-6 w-6 text-theatre-burgundy" />}
              linkTo="/admin/tickets"
            />
            <AdminCard
              title={t("admin.reports")}
              description={t("admin.reports.subtitle")}
              icon={<FileText className="h-6 w-6 text-theatre-burgundy" />}
              linkTo="/admin/reports"
            />
            <AdminCard
              title={t("admin.salaries")}
              description={t("admin.salaries.subtitle")}
              icon={<Calculator className="h-6 w-6 text-theatre-burgundy" />}
              linkTo="/admin/salaries"
            />
            <AdminCard
              title={t("admin.news")}
              description={t("admin.news.subtitle")}
              icon={<Newspaper className="h-6 w-6 text-theatre-burgundy" />}
              linkTo="/admin/news"
            />
            <AdminChangePasswordCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
