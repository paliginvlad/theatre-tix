
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Performance, getPerformances, addPerformance, updatePerformance, deletePerformance } from "@/services/adminService";
import { Plus, Edit, Trash2 } from "lucide-react";

const AdminPerformances = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [performances, setPerformances] = useState<Performance[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    description: "",
    mainImage: "",
    director: { id: "", name: "", role: "Director" },
    actors: [{ id: "actor1", name: "", role: "" }],
    creativeTeam: [{ id: "creative1", name: "", role: "" }]
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
    
    loadPerformances();
  }, [isAdmin, navigate, toast]);

  const loadPerformances = async () => {
    try {
      const data = await getPerformances();
      setPerformances(data);
    } catch (error) {
      console.error("Error loading performances:", error);
      toast({
        title: "Error",
        description: "Failed to load performances",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDirectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      director: { ...prev.director, [name.replace('director_', '')]: value }
    }));
  };

  const handleActorChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedActors = [...formData.actors];
    updatedActors[index] = { 
      ...updatedActors[index], 
      [name.replace(`actor${index}_`, '')]: value 
    };
    setFormData(prev => ({ ...prev, actors: updatedActors }));
  };

  const addActor = () => {
    setFormData(prev => ({
      ...prev,
      actors: [...prev.actors, { id: `actor${Date.now()}`, name: "", role: "" }]
    }));
  };

  const removeActor = (index: number) => {
    const updatedActors = [...formData.actors];
    updatedActors.splice(index, 1);
    setFormData(prev => ({ ...prev, actors: updatedActors }));
  };

  const handleCreativeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedTeam = [...formData.creativeTeam];
    updatedTeam[index] = { 
      ...updatedTeam[index], 
      [name.replace(`creative${index}_`, '')]: value 
    };
    setFormData(prev => ({ ...prev, creativeTeam: updatedTeam }));
  };

  const addCreativeMember = () => {
    setFormData(prev => ({
      ...prev,
      creativeTeam: [...prev.creativeTeam, { id: `creative${Date.now()}`, name: "", role: "" }]
    }));
  };

  const removeCreativeMember = (index: number) => {
    const updatedTeam = [...formData.creativeTeam];
    updatedTeam.splice(index, 1);
    setFormData(prev => ({ ...prev, creativeTeam: updatedTeam }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      startTime: "",
      description: "",
      mainImage: "",
      director: { id: "", name: "", role: "Director" },
      actors: [{ id: "actor1", name: "", role: "" }],
      creativeTeam: [{ id: "creative1", name: "", role: "" }]
    });
    setSelectedPerformance(null);
  };

  const handleEdit = (performance: Performance) => {
    setSelectedPerformance(performance);
    setFormData({
      name: performance.name,
      date: performance.date,
      startTime: performance.startTime,
      description: performance.description,
      mainImage: performance.mainImage,
      director: performance.director,
      actors: performance.actors.length ? performance.actors : [{ id: "actor1", name: "", role: "" }],
      creativeTeam: performance.creativeTeam.length ? performance.creativeTeam : [{ id: "creative1", name: "", role: "" }]
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePerformance(id);
      toast({
        title: "Success",
        description: "Performance deleted successfully",
      });
      loadPerformances();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting performance:", error);
      toast({
        title: "Error",
        description: "Failed to delete performance",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedPerformance) {
        await updatePerformance(selectedPerformance.id, {
          ...formData,
          images: selectedPerformance.images // Keep existing images
        });
        toast({
          title: "Success",
          description: "Performance updated successfully",
        });
      } else {
        await addPerformance({
          ...formData,
          images: [],
          endTime: "",
        });
        toast({
          title: "Success",
          description: "Performance added successfully",
        });
      }
      
      resetForm();
      setIsEditing(false);
      setIsAdding(false);
      loadPerformances();
    } catch (error) {
      console.error("Error saving performance:", error);
      toast({
        title: "Error",
        description: "Failed to save performance",
        variant: "destructive",
      });
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-theatre-burgundy">{t("admin.performances.title")}</h1>
            <Button 
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="bg-theatre-burgundy hover:bg-theatre-burgundy/90"
            >
              <Plus className="mr-2 h-4 w-4" /> {t("admin.performances.addNewButton")}
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.performances.name")}</TableHead>
                  <TableHead>{t("admin.performances.date")}</TableHead>
                  <TableHead>{t("admin.performances.time")}</TableHead>
                  <TableHead className="w-[150px]">{t("admin.performances.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performances.map((performance) => (
                  <TableRow key={performance.id}>
                    <TableCell className="font-medium">{performance.name}</TableCell>
                    <TableCell>{performance.date}</TableCell>
                    <TableCell>{performance.startTime}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(performance)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedPerformance(performance);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {performances.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      No performances found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Add/Edit Performance Dialog */}
      <Dialog open={isEditing || isAdding} onOpenChange={(open) => {
        if (!open) {
          setIsEditing(false);
          setIsAdding(false);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t("admin.performances.edit") : t("admin.performances.new")}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the performance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">{t("admin.performances.name")}</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="date">{t("admin.performances.date")}</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="startTime">{t("admin.performances.time")}</Label>
                  <Input 
                    id="startTime" 
                    name="startTime" 
                    type="time" 
                    value={formData.startTime} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="mainImage">Main Image URL</Label>
                  <Input 
                    id="mainImage" 
                    name="mainImage" 
                    value={formData.mainImage} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t("admin.performances.description")}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                  className="h-[180px]"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">{t("admin.performances.director")}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input 
                    name="director_name" 
                    value={formData.director.name} 
                    onChange={handleDirectorChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t("admin.performances.actors")}</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addActor}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> {t("admin.performances.ActorButton")}
                </Button>
              </div>
              
              {formData.actors.map((actor, index) => (
                <div key={actor.id || index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                  <div>
                    <Label>{t("admin.performances.nameHuman")}</Label>
                    <Input 
                      name={`actor${index}_name`} 
                      value={actor.name} 
                      onChange={(e) => handleActorChange(index, e)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label>{t("admin.performances.roleHuman")}</Label>
                    <Input 
                      name={`actor${index}_role`} 
                      value={actor.role} 
                      onChange={(e) => handleActorChange(index, e)} 
                      required 
                    />
                  </div>
                  <div>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => removeActor(index)} 
                      disabled={formData.actors.length <= 1}
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t("admin.performances.creativeTeam")}</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addCreativeMember}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> {t("admin.performances.addCreativeButton")}
                </Button>
              </div>
              
              {formData.creativeTeam.map((member, index) => (
                <div key={member.id || index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                  <div>
                    <Label>{t("admin.performances.nameHuman")}</Label>
                    <Input 
                      name={`creative${index}_name`} 
                      value={member.name} 
                      onChange={(e) => handleCreativeChange(index, e)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label>{t("admin.performances.roleHuman")}</Label>
                    <Input 
                      name={`creative${index}_role`} 
                      value={member.role} 
                      onChange={(e) => handleCreativeChange(index, e)} 
                      required 
                    />
                  </div>
                  <div>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => removeCreativeMember(index)} 
                      disabled={formData.creativeTeam.length <= 1}
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                }}
              >
                {t("admin.cancel")}
              </Button>
              <Button type="submit" className="bg-theatre-burgundy hover:bg-theatre-burgundy/90">
                {t("admin.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the performance "{selectedPerformance?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedPerformance && handleDelete(selectedPerformance.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPerformances;
