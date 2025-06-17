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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { NewsArticle, getNews, addNewsArticle, updateNewsArticle, deleteNewsArticle } from "@/services/adminService";
import { Plus, Edit, Trash2, Newspaper } from "lucide-react";

const AdminNews = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  // Мультиязычна форма
  const [activeLangTab, setActiveLangTab] = useState<'ua' | 'en'>('ua');
  const [formData, setFormData] = useState({
    title_ua: '',
    title_en: '',
    summary_ua: '',
    summary_en: '',
    content_ua: '',
    content_en: '',
    date: new Date().toISOString().split('T')[0],
    image: ''
  });

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
    
    loadNews();
  }, [isAdmin, navigate, toast]);

  const loadNews = async () => {
    try {
      const data = await getNews();
      setNews(data);
    } catch (error) {
      console.error("Error loading news:", error);
      toast({
        title: "Error",
        description: "Failed to load news articles",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title_ua: '',
      title_en: '',
      summary_ua: '',
      summary_en: '',
      content_ua: '',
      content_en: '',
      date: new Date().toISOString().split('T')[0],
      image: ''
    });
    setSelectedArticle(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article);
    setFormData({
      title_ua: article.title_ua,
      title_en: article.title_en,
      summary_ua: article.summary_ua || '',
      summary_en: article.summary_en || '',
      content_ua: article.content_ua,
      content_en: article.content_en,
      date: article.date,
      image: article.image || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsDeleteDialogOpen(true);
  };

  // --- Валидация обязательных полей перед добавлением ---
  const validateForm = () => {
    if (!formData.title_ua.trim() || !formData.title_en.trim() || !formData.content_ua.trim() || !formData.content_en.trim() || !formData.date.trim()) {
      toast({
        title: t('admin.news.validationError') || 'Error',
        description: t('admin.news.requiredFields') || 'Please fill all required fields',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const submitAdd = async () => {
    if (!validateForm()) return;
    try {
      await addNewsArticle(formData);
      toast({
        title: 'Success',
        description: 'News article added successfully',
      });
      setIsAddDialogOpen(false);
      resetForm();
      loadNews();
    } catch (error) {
      console.error('Error adding news article:', error);
      toast({
        title: 'Error',
        description: 'Failed to add news article',
        variant: 'destructive',
      });
    }
  };

  const submitEdit = async () => {
    if (!selectedArticle) return;
    
    try {
      await updateNewsArticle(selectedArticle.id, formData);
      toast({
        title: "Success",
        description: "News article updated successfully",
      });
      setIsEditDialogOpen(false);
      resetForm();
      loadNews();
    } catch (error) {
      console.error("Error updating news article:", error);
      toast({
        title: "Error",
        description: "Failed to update news article",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;
    
    try {
      await deleteNewsArticle(selectedArticle.id);
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedArticle(null);
      loadNews();
    } catch (error) {
      console.error("Error deleting news article:", error);
      toast({
        title: "Error",
        description: "Failed to delete news article",
        variant: "destructive",
      });
    }
  };

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
      <main className="flex-grow bg-gray-50 py-12 pt-28"> {/* pt-28 для отступа от Header */}
        <div className="theatre-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-theatre-burgundy">{t("admin.news.title")}</h1>
            <Button 
              onClick={handleAdd}
              className="bg-theatre-burgundy hover:bg-theatre-burgundy/90"
            >
              <Plus className="mr-2 h-4 w-4" /> {t("admin.add")}
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Publication Date</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title_ua}</TableCell>
                    <TableCell>{formatDate(article.date)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {news.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                      No news articles found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
      {/* Add News Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle>{t('admin.news.add')}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-2">
            <Button variant={activeLangTab === 'ua' ? 'default' : 'outline'} onClick={() => setActiveLangTab('ua')}>UA</Button>
            <Button variant={activeLangTab === 'en' ? 'default' : 'outline'} onClick={() => setActiveLangTab('en')}>EN</Button>
          </div>
          {activeLangTab === 'ua' ? (
            <>
              <Label>Заголовок</Label>
              <Input name="title_ua" value={formData.title_ua} onChange={handleInputChange} />
              <Label>Короткий опис</Label>
              <Textarea name="summary_ua" value={formData.summary_ua} onChange={handleInputChange} />
              <Label>Текст новини</Label>
              <Textarea name="content_ua" value={formData.content_ua} onChange={handleInputChange} />
            </>
          ) : (
            <>
              <Label>Title</Label>
              <Input name="title_en" value={formData.title_en} onChange={handleInputChange} />
              <Label>Summary</Label>
              <Textarea name="summary_en" value={formData.summary_en} onChange={handleInputChange} />
              <Label>News text</Label>
              <Textarea name="content_en" value={formData.content_en} onChange={handleInputChange} />
            </>
          )}
          <Label>Дата</Label>
          <Input name="date" type="date" value={formData.date} onChange={handleInputChange} />
          <Label>Зображення</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {formData.image && <img src={formData.image} alt="preview" style={{ maxWidth: 200, marginTop: 8 }} />}
          <DialogFooter>
            <Button onClick={submitAdd}>{t('admin.news.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit News Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle>{t('admin.news.edit')}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-2">
            <Button variant={activeLangTab === 'ua' ? 'default' : 'outline'} onClick={() => setActiveLangTab('ua')}>UA</Button>
            <Button variant={activeLangTab === 'en' ? 'default' : 'outline'} onClick={() => setActiveLangTab('en')}>EN</Button>
          </div>
          {activeLangTab === 'ua' ? (
            <>
              <Label>Заголовок</Label>
              <Input name="title_ua" value={formData.title_ua} onChange={handleInputChange} />
              <Label>Короткий опис</Label>
              <Textarea name="summary_ua" value={formData.summary_ua} onChange={handleInputChange} />
              <Label>Текст новини</Label>
              <Textarea name="content_ua" value={formData.content_ua} onChange={handleInputChange} />
            </>
          ) : (
            <>
              <Label>Title</Label>
              <Input name="title_en" value={formData.title_en} onChange={handleInputChange} />
              <Label>Summary</Label>
              <Textarea name="summary_en" value={formData.summary_en} onChange={handleInputChange} />
              <Label>News text</Label>
              <Textarea name="content_en" value={formData.content_en} onChange={handleInputChange} />
            </>
          )}
          <Label>Дата</Label>
          <Input name="date" type="date" value={formData.date} onChange={handleInputChange} />
          <Label>Зображення</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {formData.image && <img src={formData.image} alt="preview" style={{ maxWidth: 200, marginTop: 8 }} />}
          <DialogFooter>
            <Button onClick={submitEdit}>{t('admin.news.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the article "{selectedArticle?.title_ua || selectedArticle?.title_en}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNews;
