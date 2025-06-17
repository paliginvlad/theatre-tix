import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { User, Upload, Ticket } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  const { language, t } = useLanguage();
  const { currentUser, updateUserProfile, isAuthenticated, userTickets, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordEdit, setIsPasswordEdit] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [isUsernameEdit, setIsUsernameEdit] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [usernameError, setUsernameError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || ""
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ photoURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUsernameChange = async () => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    }
    try {
      const res = await axios.post("http://localhost:4000/api/update-username", {
        oldUsername: currentUser?.username,
        newUsername: username.trim(),
      });
      setUsernameError("");
      setIsUsernameEdit(false);
      // Обновить username в контексте пользователя
      updateUserProfile({ username: username.trim() });
      window.location.reload(); // Принудительно обновить страницу для корректного отображения
    } catch (error: any) {
      setUsernameError(error?.response?.data?.error || "Failed to update username");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordError("Both fields are required");
      return;
    }
    try {
      await axios.post("http://localhost:4000/api/update-password", {
        username: currentUser?.username,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordError("");
      setIsPasswordEdit(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
      // Можно добавить уведомление об успешной смене пароля
    } catch (error: any) {
      setPasswordError(error?.response?.data?.error || "Failed to update password");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.post("http://localhost:4000/api/delete-profile", {
        username: currentUser?.username,
      });
      setIsDeleteDialogOpen(false);
      logout();
      window.location.href = "/login";
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to delete profile");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="theatre-container py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{t("profile.title")}</h1>
      
      <Tabs defaultValue="info" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="info" className="text-lg">{t("profile.tabs.info")}</TabsTrigger>
          <TabsTrigger value="tickets" className="text-lg">{t("profile.tabs.tickets")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center md:justify-between">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-4 mb-4 md:mb-0">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={currentUser?.photoURL} alt={currentUser?.firstName} />
                      <AvatarFallback className="bg-theatre-burgundy text-white text-xl">
                        {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 bg-theatre-burgundy hover:bg-theatre-burgundy/90 rounded-full w-8 h-8"
                      onClick={triggerFileInput}
                    >
                      <Upload size={16} />
                      <span className="sr-only">Upload photo</span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl">{currentUser?.firstName} {currentUser?.lastName}</CardTitle>
                    <CardDescription className="text-lg">{currentUser?.email}</CardDescription>
                  </div>
                </div>
                
                {!isEditing && (
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-theatre-burgundy hover:bg-theatre-burgundy/90 text-white"
                    >
                      {t("profile.edit")}
                    </Button>
                  
                   
                    <Button 
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      {t("profile.deleteProfile")}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("profile.email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsUsernameEdit(true)}
                      >
                        {t("profile.editUsername")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPasswordEdit(true)}
                      >
                        {t("profile.editPassword")}
                      </Button>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        {t("profile.cancel")}
                      </Button>
                      <Button
                        type="submit"
                        className="bg-theatre-burgundy hover:bg-theatre-burgundy/90 text-white"
                      >
                        {t("profile.save")}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg">{t("profile.username")}</h3>
                    <p>{currentUser?.username}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg">{t("profile.firstName")}</h3>
                      <p>{currentUser?.firstName}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{t("profile.lastName")}</h3>
                      <p>{currentUser?.lastName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{t("profile.email")}</h3>
                    <p>{currentUser?.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Ticket className="mr-2" />
                {t("profile.tickets.title")}
              </CardTitle>
              <CardDescription>{t("profile.tickets.subtitle")}</CardDescription>
            </CardHeader>
            
            <CardContent>
              {userTickets.length > 0 ? (
                <div className="space-y-6">
                  {userTickets.map((ticket) => (
                    <Card key={ticket.id} className="overflow-hidden transition-all hover:shadow-md">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div>
                            <h3 className="font-bold text-lg text-theatre-burgundy">{ticket.performanceName}</h3>
                            <p className="text-gray-600">{formatDate(ticket.date)} at {ticket.time}</p>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-theatre-gold/20 text-theatre-black">
                              {ticket.level}
                            </span>
                            <p className="mt-1 font-medium">Seat: {ticket.seat}</p>
                            <p className="text-gray-600">{ticket.price} ₴</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-4">
                          <Button variant="outline" className="border-theatre-burgundy text-theatre-burgundy hover:bg-theatre-burgundy hover:text-white">
                            Download
                          </Button>
                          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            Return
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">{t("profile.tickets.empty.title")}</h3>
                  <p className="mt-1 text-gray-500">{t("profile.tickets.empty.subtitle")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isUsernameEdit} onOpenChange={setIsUsernameEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.editUsername")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="username">{t("profile.username")}</Label>
            <Input id="username" value={username} onChange={e => setUsername(e.target.value)} />
            {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUsernameEdit(false)}>{t("profile.cancel")}</Button>
            <Button onClick={handleUsernameChange} className="bg-theatre-burgundy text-white">{t("profile.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isPasswordEdit} onOpenChange={setIsPasswordEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.editPassword")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="oldPassword">{t("profile.oldPassword")}</Label>
            <Input id="oldPassword" type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
            <Label htmlFor="newPassword">{t("profile.newPassword")}</Label>
            <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordEdit(false)}>{t("profile.cancel")}</Button>
            <Button onClick={handlePasswordChange} className="bg-theatre-burgundy text-white">{t("profile.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.deleteProfile")}</DialogTitle>
          </DialogHeader>
          <div className="mb-4">Are you sure you want to delete your profile?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t("profile.cancel")}</Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>{t("profile.deleteProfile")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
